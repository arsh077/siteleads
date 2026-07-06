'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '../lib/dal';
import { addLeadResponse, LeadStatus } from '../lib/db';

export async function submitLeadResponseAction(
  prevState: { error: string; success?: string },
  formData: FormData
) {
  const leadId = formData.get('leadId') as string;
  const status = formData.get('status') as LeadStatus;
  const note = formData.get('note') as string;
  const nextFollowupDate = formData.get('nextFollowupDate') as string;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: 'Authentication required.' };
  }
  if (currentUser.role !== 'employee' && currentUser.role !== 'admin') {
    return { error: 'Access denied.' };
  }

  if (!note || !note.trim()) {
    return { error: 'Response note/remark is required.' };
  }

  try {
    addLeadResponse(
      leadId,
      currentUser.id,
      currentUser.displayName || 'Staff',
      status,
      note.trim(),
      nextFollowupDate ? new Date(nextFollowupDate).toISOString() : undefined
    );

    revalidatePath(`/employee/leads/${leadId}`);
    revalidatePath('/employee/leads');
    revalidatePath('/admin');

    return { error: '', success: 'Call response logged successfully!' };
  } catch (err: any) {
    return { error: err.message || 'Failed to save call response.' };
  }
}
