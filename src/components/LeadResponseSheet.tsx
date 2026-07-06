import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, LeadUpdate, User } from '../types';
import { getUpdates, addLeadResponse } from '../services/storage';
import { 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Send, 
  User as UserIcon, 
  Copy, 
  Check,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface LeadResponseSheetProps {
  lead: Lead | null;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: () => void;
}

export const LeadResponseSheet: React.FC<LeadResponseSheetProps> = ({
  lead,
  currentUser,
  isOpen,
  onClose,
  onLeadUpdated
}) => {
  const [status, setStatus] = useState<LeadStatus>('Called');
  const [note, setNote] = useState('');
  const [nextFollowup, setNextFollowup] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updatesHistory, setUpdatesHistory] = useState<LeadUpdate[]>([]);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status || 'Called');
      setNote('');
      setNextFollowup('');
      
      // Load history
      const allUpdates = getUpdates();
      const leadHistory = allUpdates.filter((u) => u.leadId === lead.id);
      setUpdatesHistory(leadHistory);
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleCopyContact = () => {
    const text = `${lead.name} - ${lead.phone}${lead.email ? ' - ' + lead.email : ''}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSaving(true);

    setTimeout(() => {
      const newUp = addLeadResponse(
        lead.id,
        currentUser.id,
        currentUser.name,
        status,
        note.trim(),
        nextFollowup ? new Date(nextFollowup).toISOString() : undefined
      );

      setUpdatesHistory((prev) => [newUp, ...prev]);
      setNote('');
      setNextFollowup('');
      setIsSaving(false);
      onLeadUpdated();
    }, 250);
  };

  const getStatusBadgeClass = (st: LeadStatus) => {
    switch (st) {
      case 'New':
        return 'bg-white/10 text-white/70 border-white/20';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Called':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Follow Up':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Interested':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Converted':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Not Interested':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-white/10 text-white/70';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end p-0 sm:p-4 animate-fadeIn">
      <div className="glass-panel w-full max-w-lg h-full sm:h-auto sm:max-h-[95vh] flex flex-col border-l sm:border border-white/10 shadow-2xl rounded-none sm:rounded-2xl overflow-hidden bg-[#0F172A]">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white truncate max-w-[220px]">
                {lead.name}
              </h2>
              <span className={`status-badge text-[10px] border mt-1 ${getStatusBadgeClass(lead.status)}`}>
                ● {lead.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Contact Action Card */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Contact Details
              </p>
              <button
                type="button"
                onClick={handleCopyContact}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied!' : 'Copy Info'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href={`tel:${lead.phone}`}
                className="p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center gap-2 transition-all font-mono"
              >
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">{lead.phone}</span>
              </a>

              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 flex items-center gap-2 transition-all truncate"
                >
                  <Mail className="w-4 h-4 text-white/50 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </a>
              ) : (
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-white/40 flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>No Email</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-white/40 flex items-center justify-between pt-1">
              <span>Source: <span className="text-white/70">{lead.source || 'Screenshot Dump'}</span></span>
              <span>Assigned to: <span className="text-blue-400 font-medium">{lead.assignedToName}</span></span>
            </div>
          </div>

          {/* New Response Log Form (Sheet Maintenance) */}
          <form onSubmit={handleSaveResponse} className="space-y-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              Log New Call / Response Update
            </p>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Update Response Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full bg-[#0F172A] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500"
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
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write detailed call outcome (e.g. Discussed pricing plan, client requested callback tomorrow at 4 PM)..."
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
                value={nextFollowup}
                onChange={(e) => setNextFollowup(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving || !note.trim()}
              className="w-full btn-primary py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Save Response to Sheet
                </>
              )}
            </button>
          </form>

          {/* Response History Timeline Sheet */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              Response History Log ({updatesHistory.length})
            </h3>

            {updatesHistory.length === 0 ? (
              <div className="p-6 text-center text-white/40 text-xs bg-white/5 rounded-xl border border-white/5">
                No previous response notes logged for this lead yet.
              </div>
            ) : (
              <div className="space-y-3">
                {updatesHistory.map((up) => (
                  <div key={up.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`status-badge border text-[9px] ${getStatusBadgeClass(up.status)}`}>
                          ● {up.status}
                        </span>
                        <span className="font-semibold text-white/80">{up.userName}</span>
                      </div>
                      <span className="text-[10px] text-white/40">
                        {new Date(up.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>

                    <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                      {up.note}
                    </p>

                    {up.nextFollowupDate && (
                      <div className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        Next Follow-up: {new Date(up.nextFollowupDate).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
