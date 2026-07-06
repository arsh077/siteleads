import { requireEmployee } from '../../../lib/dal';
import { getLeads, getUpdates } from '../../../lib/db';
import Navbar from '../../../ui/navbar';
import LeadResponseForm from '../../../ui/employee/lead-response-form';
import { Phone, Mail, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    leadId: string;
  }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const employee = await requireEmployee();
  const { leadId } = await params;

  const leads = getLeads();
  const lead = leads.find((l) => l.id === leadId);

  // Security check: Ensure the employee only views their own assigned leads (admins can view all)
  if (!lead || (employee.role === 'employee' && lead.assignedToId !== employee.id)) {
    notFound();
  }

  const allUpdates = getUpdates();
  const updatesHistory = allUpdates.filter((u) => u.leadId === leadId);

  const getStatusBadgeClass = (st: string) => {
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
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Navbar activeTab="dashboard" />

      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Back Link */}
        <Link
          href="/employee/leads"
          className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assigned Leads Sheet
        </Link>

        {/* Lead Identity Summary Card */}
        <div className="glass-panel p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white truncate max-w-[280px]">
              {lead.name}
            </h2>
            <span className={`status-badge text-[10px] border mt-1.5 ${getStatusBadgeClass(lead.status)}`}>
              ● {lead.status}
            </span>
          </div>
          
          <div className="text-xs text-white/40 text-right sm:self-end">
            <p>Source: <span className="text-white/70">{lead.source || 'Screenshot Dump'}</span></p>
            <p className="mt-0.5">Assigned: <span className="text-blue-400 font-medium">{lead.assignedToName}</span></p>
          </div>
        </div>

        {/* Main Grid: Left details, Right Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Detail Side Info */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Contact details */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Contact Details
              </p>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
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
                    <span>No Email Registered</span>
                  </div>
                )}
              </div>
            </div>

            {/* Response History Logs */}
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
                        <span className="text-[10px] text-white/40 font-mono">
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

          {/* Form Side */}
          <div className="md:col-span-5">
            <LeadResponseForm leadId={leadId} currentStatus={lead.status} />
          </div>

        </div>

      </main>
    </div>
  );
}
