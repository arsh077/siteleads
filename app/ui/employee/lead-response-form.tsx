'use client';

import { useActionState } from 'react';
import { submitLeadResponseAction } from '../../actions/employee-leads';
import { MessageSquare, Calendar, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface LeadResponseFormProps {
  leadId: string;
  currentStatus: string;
}

const initialState = {
  error: '',
  success: ''
};

export default function LeadResponseForm({ leadId, currentStatus }: LeadResponseFormProps) {
  const [state, action, pending] = useActionState(submitLeadResponseAction, initialState);

  return (
    <form action={action} className="space-y-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
        <MessageSquare className="w-4 h-4" />
        Log New Call / Response Update
      </p>

      {state.error && (
        <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{state.success}</span>
        </div>
      )}

      <input type="hidden" name="leadId" value={leadId} />

      {/* Status Selector */}
      <div>
        <label className="block text-xs font-medium text-white/70 mb-1.5">
          Update Response Status
        </label>
        <select
          name="status"
          defaultValue={currentStatus}
          className="w-full bg-[#0F172A] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="Called">📞 Called / Contacted</option>
          <option value="In Progress">⏳ In Progress / Discussing</option>
          <option value="Follow Up">📅 Follow Up Required</option>
          <option value="Interested">⭐ Interested Client</option>
          <option value="Converted">🎉 Converted / Sale Closed</option>
          <option value="Not Interested">❌ Not Interested</option>
        </select>
      </div>

      {/* Response Notes / Call Summary */}
      <div>
        <label className="block text-xs font-medium text-white/70 mb-1.5">
          Response Summary & Remarks
        </label>
        <textarea
          name="note"
          placeholder="Write detailed call outcome (e.g. Discussed pricing plan, client requested callback tomorrow)..."
          rows={3}
          required
          className="w-full bg-[#0F172A] border border-white/15 rounded-lg p-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500"
        />
      </div>

      {/* Optional Next Follow-up Date */}
      <div>
        <label className="block text-xs font-medium text-white/70 mb-1.5 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          Schedule Next Follow-Up Date (Optional)
        </label>
        <input
          type="datetime-local"
          name="nextFollowupDate"
          className="w-full bg-[#0F172A] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full btn btn-primary py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
      >
        {pending ? (
          'Saving Response...'
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Save Response to Sheet
          </>
        )}
      </button>
    </form>
  );
}
