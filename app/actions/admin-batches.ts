'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { distributeLeadsEqually, parseLeadsFromText, getBatches, saveBatches, LeadBatch } from '../lib/db';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function uploadBatchAction(
  prevState: { error: string; success?: string; summary?: string },
  formData: FormData
) {
  const file = formData.get('file') as File | null;
  const rawText = formData.get('rawText') as string | null;
  const batchNotes = formData.get('notes') as string | null;

  let imageUrls: string[] = [];

  // 1. Process File Upload (if image is present)
  if (file && file.size > 0) {
    if (!file.type.startsWith('image/')) {
      return { error: 'Please upload a valid image file.' };
    }

    try {
      // Create public/uploads directory if it doesn't exist
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }

      const fileExtension = path.extname(file.name) || '.png';
      const uniqueFilename = `ss-${Date.now()}-${Math.floor(Math.random() * 1000)}${fileExtension}`;
      const savePath = path.join(UPLOADS_DIR, uniqueFilename);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(savePath, buffer);
      imageUrls.push(`/uploads/${uniqueFilename}`);
    } catch (err: any) {
      return { error: `Failed to save screenshot: ${err.message || err}` };
    }
  }

  // 2. Extract Leads
  let leadsToDistribute: Array<{ name: string; phone: string; email?: string; source?: string }> = [];

  if (rawText && rawText.trim().length > 0) {
    // Parse text input line by line
    const parsed = parseLeadsFromText(rawText);
    leadsToDistribute = parsed.map((p) => ({
      name: p.name,
      phone: p.phone,
      email: p.email,
      source: 'Pasted Screenshot Dump'
    }));
  } else if (file && file.size > 0) {
    // If screenshot is uploaded, simulate lead extraction with mock data
    leadsToDistribute = [
      { name: 'Rakesh Verma', phone: '+91 98123 45678', email: 'rakesh.v@gmail.com', source: 'Screenshot Dump' },
      { name: 'Simran Kaur', phone: '+91 88990 11223', email: 'simran.k@yahoo.com', source: 'Screenshot Dump' },
      { name: 'Sunil Joshi', phone: '+91 70112 33445', email: 'sunil.j@outlook.com', source: 'Screenshot Dump' },
      { name: 'Deepak Rao', phone: '+91 99001 88776', email: 'deepak.r@corp.in', source: 'Screenshot Dump' }
    ];
  }

  if (leadsToDistribute.length === 0) {
    return { error: 'No lead rows extracted. Please paste contact lines or upload a screenshot.' };
  }

  // 3. Save Batch record & Distribute equally
  try {
    const batchId = `batch-${Date.now()}`;
    const newBatch: LeadBatch = {
      id: batchId,
      uploadedBy: 'admin',
      imageUrls,
      leadCount: leadsToDistribute.length,
      notes: batchNotes || `Uploaded ${imageUrls.length} screenshot(s) with ${leadsToDistribute.length} leads`,
      createdAt: new Date().toISOString()
    };

    const existingBatches = getBatches();
    saveBatches([newBatch, ...existingBatches]);

    const result = distributeLeadsEqually(leadsToDistribute, batchId);

    revalidatePath('/admin');
    revalidatePath('/employee/leads');
    
    return {
      error: '',
      success: 'Leads processed successfully!',
      summary: result.summaryText
    };
  } catch (err: any) {
    return { error: err.message || 'Failed to distribute leads.' };
  }
}

export async function redistributeAllLeadsAction() {
  try {
    const { redistributeAllLeadsEqually } = await import('../lib/db');
    const result = redistributeAllLeadsEqually();
    revalidatePath('/admin');
    revalidatePath('/employee/leads');
    return { success: true, summary: result.summaryText };
  } catch (err: any) {
    return { error: err.message || 'Failed to redistribute leads.' };
  }
}

