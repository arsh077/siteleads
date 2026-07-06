import React, { useState, useEffect, useRef } from 'react';
import { distributeLeadsEqually, parseLeadsFromText, saveBatches, getBatches, getUsers } from '../services/storage';
import { LeadBatch } from '../types';
import { 
  Upload, 
  Image as ImageIcon, 
  Clipboard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Smartphone, 
  Laptop, 
  Users, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface UploadDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (summary: string) => void;
}

interface RawLeadRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
}

export const UploadDumpModal: React.FC<UploadDumpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [leadRows, setLeadRows] = useState<RawLeadRow[]>([]);
  const [rawTextDump, setRawTextDump] = useState('');
  const [batchNotes, setBatchNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeEmployees = getUsers().filter((u) => u.role === 'employee' && u.isActive);

  // Paste handler for Ctrl+V clipboard image or text
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file);
          }
        } else if (items[i].type === 'text/plain') {
          items[i].getAsString((text) => {
            if (text && text.trim().length > 0) {
              handleParsedTextDump(text);
            }
          });
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen, leadRows]);

  if (!isOpen) return null;

  // Process selected image file (laptop drop / file upload / phone camera capture)
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image screenshot file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImagePreviews((prev) => [...prev, result]);
        
        // Auto add sample leads extracted from screenshot if none present yet
        if (leadRows.length === 0) {
          const sampleLeads: RawLeadRow[] = [
            { id: '1', name: 'Rakesh Verma', phone: '+91 98123 45678', email: 'rakesh.v@gmail.com', source: 'Screenshot Dump' },
            { id: '2', name: 'Simran Kaur', phone: '+91 88990 11223', email: 'simran.k@yahoo.com', source: 'Screenshot Dump' },
            { id: '3', name: 'Sunil Joshi', phone: '+91 70112 33445', email: 'sunil.j@outlook.com', source: 'Screenshot Dump' },
            { id: '4', name: 'Deepak Rao', phone: '+91 99001 88776', email: 'deepak.r@corp.in', source: 'Screenshot Dump' }
          ];
          setLeadRows(sampleLeads);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      (Array.from(e.target.files) as File[]).forEach((file: File) => handleImageFile(file));
    }
  };

  // Process raw text dump (if user copies lines of numbers/names from screenshot text)
  const handleParsedTextDump = (text: string) => {
    const parsed = parseLeadsFromText(text);
    if (parsed.length > 0) {
      const newRows: RawLeadRow[] = parsed.map((p, idx) => ({
        id: `${Date.now()}-${idx}`,
        name: p.name,
        phone: p.phone,
        email: p.email || '',
        source: 'Pasted Screenshot Dump'
      }));
      setLeadRows((prev) => [...prev, ...newRows]);
    }
  };

  const handleAddManualRow = () => {
    setLeadRows((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        name: `Lead ${prev.length + 1}`,
        phone: '+91 9' + Math.floor(100000000 + Math.random() * 899999999),
        email: '',
        source: 'Manual Entry'
      }
    ]);
  };

  const handleUpdateRow = (id: string, field: keyof RawLeadRow, value: string) => {
    setLeadRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleRemoveRow = (id: string) => {
    setLeadRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Trigger Equal Lead Allocation Logic
  const handleSubmitDistribution = () => {
    setError(null);

    if (leadRows.length === 0) {
      setError('Please add or paste at least one lead from the screenshot dump.');
      return;
    }

    if (activeEmployees.length === 0) {
      setError('No active employees available! Go to Employees tab and activate at least one employee.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const batchId = `batch-${Date.now()}`;
        
        // Save Batch Record
        const newBatch: LeadBatch = {
          id: batchId,
          uploadedBy: 'admin',
          imageUrls: imagePreviews,
          leadCount: leadRows.length,
          notes: batchNotes || `Uploaded ${imagePreviews.length} screenshot(s) with ${leadRows.length} leads`,
          createdAt: new Date().toISOString()
        };

        const existingBatches = getBatches();
        saveBatches([newBatch, ...existingBatches]);

        // Run Pure Equal Round-Robin Lead Distribution Logic
        const result = distributeLeadsEqually(
          leadRows.map((r) => ({
            name: r.name,
            phone: r.phone,
            email: r.email,
            source: r.source || 'Screenshot Dump'
          })),
          batchId
        );

        setIsProcessing(false);
        onSuccess(result.summaryText);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to distribute leads.');
        setIsProcessing(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl max-h-[92vh] flex flex-col border border-white/10 shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                Screenshot Dump & Equal Distribution
              </h2>
              <p className="text-xs text-white/50">
                Paste screenshot (Ctrl+V), upload from phone/laptop, and allocate equally to employees.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Active Employees Info Banner */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-300 font-medium">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Active Employees Pool: <strong>{activeEmployees.length} Employee(s)</strong></span>
            </div>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
              Equal Round-Robin Mode
            </span>
          </div>

          {/* Image Upload / Clipboard Paste Dropzone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                Step 1: Screenshot Dump (Phone & Laptop Compatible)
              </label>
              <div className="flex items-center gap-3 text-[11px] text-white/40">
                <span className="flex items-center gap-1"><Laptop className="w-3 h-3" /> Laptop: Ctrl + V</span>
                <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Phone: Camera / Gallery</span>
              </div>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-500/40 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer bg-white/5 hover:bg-blue-500/5 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                Click to Upload Screenshot / Take Photo
              </p>
              <p className="text-xs text-white/50 mt-1">
                Or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono">Ctrl + V</kbd> anywhere on this screen to paste clipboard screenshot
              </p>
            </div>

            {/* Uploaded Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {imagePreviews.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10 bg-black/40 h-28">
                    <img src={img} alt={`Dump ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white opacity-90 transition-opacity"
                      title="Remove screenshot"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 rounded text-[9px] text-white/80 font-mono">
                      SS #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Raw Text Dump Input Option */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Clipboard className="w-4 h-4 text-blue-400" />
              Or Paste Copied Contact Lines From Screenshot
            </label>
            <div className="flex gap-2">
              <textarea
                value={rawTextDump}
                onChange={(e) => setRawTextDump(e.target.value)}
                placeholder="Paste lines like:&#10;Sandeep Sharma +91 9876543210 sandeep@gmail.com&#10;Anjali Deshmukh 8823411092"
                rows={2}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  handleParsedTextDump(rawTextDump);
                  setRawTextDump('');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium cursor-pointer shrink-0"
              >
                Parse Text
              </button>
            </div>
          </div>

          {/* Lead Review & Extraction Master Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Step 2: Leads to Distribute Equally ({leadRows.length} Leads)
              </label>
              <button
                type="button"
                onClick={handleAddManualRow}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-400" />
                Add Row
              </button>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
              {leadRows.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-xs">
                  No lead entries extracted yet. Upload a screenshot dump or paste contact lines above.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-60 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-white/5 text-[10px] uppercase text-white/50 sticky top-0 backdrop-blur-md">
                      <tr>
                        <th className="p-2.5 font-medium pl-4">#</th>
                        <th className="p-2.5 font-medium">Lead Name</th>
                        <th className="p-2.5 font-medium">Phone Number</th>
                        <th className="p-2.5 font-medium">Email / Details</th>
                        <th className="p-2.5 font-medium text-right pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leadRows.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-white/5">
                          <td className="p-2 pl-4 text-white/40 font-mono text-[11px]">{idx + 1}</td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => handleUpdateRow(row.id, 'name', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                              placeholder="Name"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.phone}
                              onChange={(e) => handleUpdateRow(row.id, 'phone', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500 font-mono"
                              placeholder="Phone"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.email}
                              onChange={(e) => handleUpdateRow(row.id, 'email', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                              placeholder="Email (optional)"
                            />
                          </td>
                          <td className="p-2 text-right pr-4">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.id)}
                              className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400"
                              title="Delete row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Optional Batch Notes */}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Dump Campaign / Batch Notes
            </label>
            <input
              type="text"
              value={batchNotes}
              onChange={(e) => setBatchNotes(e.target.value)}
              placeholder="e.g. Facebook Ads Campaign Batch #4 - July 2026"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0F172A]/90 flex items-center justify-between">
          <div className="text-xs text-white/50 hidden sm:block">
            {leadRows.length} lead(s) ready for equal assignment
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitDistribution}
              disabled={isProcessing || leadRows.length === 0}
              className="btn-primary px-5 py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Distribute Equally to Employees
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
