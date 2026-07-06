'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { uploadBatchAction } from '../../actions/admin-batches';
import { Upload, ImageIcon, Clipboard, CheckCircle2, AlertCircle } from 'lucide-react';

const initialState = {
  error: '',
  success: '',
  summary: ''
};

export default function UploadZone() {
  const [state, action, pending] = useActionState(uploadBatchAction, initialState);
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Ignore if user is active in text areas or text input elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'file')) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            if (fileInputRef.current) {
              fileInputRef.current.files = dataTransfer.files;
              setFileSelected(`Pasted Screenshot (${(file.size / 1024).toFixed(0)} KB)`);
            }
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0].name);
    } else {
      setFileSelected(null);
    }
  };

  return (
    <div className="glass-panel p-5 space-y-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
          Upload screenshot dump / paste contacts
        </h3>
        <p className="text-[11px] text-white/60 mt-0.5">
          Select screenshot file, paste raw contact text, or directly paste a screenshot from your clipboard.
        </p>
      </div>

      {state.error && (
        <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{state.success}</span>
          </div>
          {state.summary && (
            <p className="text-[11px] text-emerald-400/90 leading-tight">
              {state.summary}
            </p>
          )}
        </div>
      )}

      <form action={action} className="space-y-4 text-xs">
        {/* File upload input */}
        <label className="border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 rounded-xl p-4 text-center cursor-pointer bg-white/5 hover:bg-blue-500/5 transition-all block relative">
          <input
            type="file"
            name="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <p className="font-semibold text-white">
            {fileSelected ? `Selected: ${fileSelected}` : 'Click to Upload or Paste Screenshot (Ctrl+V)'}
          </p>
          <p className="text-[10px] text-white/40 mt-1">
            Accepts image files and direct clipboard paste dumps
          </p>
        </label>

        {/* Text Paste input */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-white/60 flex items-center gap-1.5">
            <Clipboard className="w-3.5 h-3.5 text-blue-400" />
            OR PASTE COPIED CONTACT LINES
          </label>
          <textarea
            name="rawText"
            rows={2}
            placeholder="e.g. Rakesh Verma +91 98123 45678&#10;Simran Kaur +91 88990 11223"
            className="w-full bg-slate-950/60 border border-white/10 rounded-lg p-2.5 text-white placeholder-white/30 outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Campaign Notes */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-white/60">Campaign / Batch Notes</label>
          <input
            type="text"
            name="notes"
            placeholder="e.g. FB Ad Campaign #3"
            className="w-full bg-slate-950/60 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full btn btn-primary py-2 rounded-lg text-xs font-semibold text-white"
        >
          {pending ? 'Processing and Distributing...' : 'Distribute Equally to Employees'}
        </button>
      </form>
    </div>
  );
}
