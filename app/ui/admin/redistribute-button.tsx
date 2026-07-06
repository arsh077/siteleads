'use client';

import { useState, useTransition } from 'react';
import { redistributeAllLeadsAction } from '../../actions/admin-batches';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RedistributeButton() {
  const [isPending, startTransition] = useTransition();
  const [banner, setBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRedistribute = () => {
    setError(null);
    setBanner(null);
    startTransition(async () => {
      const res = await redistributeAllLeadsAction();
      if ('error' in res && res.error) {
        setError(res.error);
      } else if (res.success) {
        setBanner(res.summary || 'All leads re-balanced successfully.');
        setTimeout(() => setBanner(null), 5000);
      }
    });
  };

  return (
    <div className="space-y-3">
      {banner && (
        <div className="p-3 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{banner}</span>
          </div>
          <button onClick={() => setBanner(null)} className="font-bold text-white/80 hover:text-white">×</button>
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleRedistribute}
        disabled={isPending}
        className="w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isPending ? 'animate-spin' : ''}`} />
        Re-balance All Leads Equally
      </button>
    </div>
  );
}
