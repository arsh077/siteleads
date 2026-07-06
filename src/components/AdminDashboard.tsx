import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, User } from '../types';
import { 
  getLeads, 
  getUsers, 
  getBatches, 
  redistributeAllLeadsEqually 
} from '../services/storage';
import { UploadDumpModal } from './UploadDumpModal';
import { LeadResponseSheet } from './LeadResponseSheet';
import { 
  Users, 
  FileSpreadsheet, 
  Search, 
  RefreshCw, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  PhoneCall, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Sparkles,
  BarChart2,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDumpModalOpen, setIsDumpModalOpen] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const refreshData = () => {
    setLeads(getLeads());
    setUsers(getUsers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const activeEmployees = users.filter((u) => u.role === 'employee' && u.isActive);
  const allEmployees = users.filter((u) => u.role === 'employee');

  // Lead Distribution Counts per Employee
  const employeeLeadCounts: Record<string, number> = {};
  leads.forEach((l) => {
    if (l.assignedToId) {
      employeeLeadCounts[l.assignedToId] = (employeeLeadCounts[l.assignedToId] || 0) + 1;
    }
  });

  // Re-balance All Leads Equally
  const handleRedistributeAll = () => {
    try {
      const res = redistributeAllLeadsEqually();
      refreshData();
      setToastMessage(res.summaryText);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filter & Search
  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.assignedToName && l.assignedToName.toLowerCase().includes(q)) ||
      l.status.toLowerCase().includes(q)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-blue-600 text-white shadow-xl flex items-center justify-between animate-fadeIn text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Top Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Distribution Control Panel */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center justify-between">
              <span>Distribution Control</span>
              <span className="text-blue-400 font-mono text-[10px]">Purity: Pure Logic</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-white/60 mb-1">Active Employees</p>
                <p className="text-2xl font-bold text-white">{activeEmployees.length}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-white/60 mb-1">Distribution Logic</p>
                <p className="text-xs font-semibold text-blue-400 flex items-center gap-1 mt-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Equal Round-Robin
                </p>
              </div>
            </div>

            {/* Re-distribute Button */}
            <button
              onClick={handleRedistributeAll}
              className="w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              Re-balance All Leads Equally
            </button>
          </div>

          {/* Employee Distribution Shares List */}
          <div className="glass-panel p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
                Employee Status & Load
              </h3>
              <span className="text-[10px] text-white/40">Equal Share</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {allEmployees.map((emp) => {
                const count = employeeLeadCounts[emp.id] || 0;
                return (
                  <div key={emp.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${emp.isActive ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-white/20'}`} />
                      <span className={`font-medium ${emp.isActive ? 'text-white' : 'text-white/40'}`}>
                        {emp.name}
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono font-semibold ${emp.isActive ? 'text-blue-400' : 'text-white/20'}`}>
                      {count} Lead{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Action & Stats Grid */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Top Quick KPI Bar + Paste Screenshot Button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Total Leads KPI */}
            <div className="glass-panel p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Total Leads</p>
                <h4 className="text-2xl font-bold text-white mt-0.5">{leads.length}</h4>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
            </div>

            {/* Active Employees KPI */}
            <div className="glass-panel p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Active Pool</p>
                <h4 className="text-2xl font-bold text-emerald-400 mt-0.5">+{activeEmployees.length}</h4>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Primary CTA: Paste Screenshot Dump Button */}
            <button
              onClick={() => setIsDumpModalOpen(true)}
              className="glass-panel p-4 border-dashed border-2 border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all group"
            >
              <span className="text-blue-400 font-semibold text-xs sm:text-sm flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                <Upload className="w-4 h-4" />
                + Paste Screenshot Dump
              </span>
              <span className="text-[10px] text-white/40">
                Laptop (Ctrl+V) or Phone Upload
              </span>
            </button>
          </div>

          {/* Active Leads Master Sheet Table */}
          <div className="glass-panel flex-1 flex flex-col overflow-hidden shadow-xl">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold text-white text-sm sm:text-base">
                  Active Leads Master Sheet
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search leads..."
                    className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 w-full"
                  />
                </div>

                <button
                  onClick={() => setIsDumpModalOpen(true)}
                  className="btn-primary text-xs px-3.5 py-1.5 rounded-lg font-medium text-white flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Leads Dump
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              {paginatedLeads.length === 0 ? (
                <div className="p-12 text-center text-white/40 text-xs">
                  No leads found. Click "+ Paste Screenshot Dump" to upload new leads.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-white/40 border-b border-white/10">
                    <tr>
                      <th className="px-5 py-3 font-medium">Lead Name</th>
                      <th className="px-5 py-3 font-medium">Contact</th>
                      <th className="px-5 py-3 font-medium">Assigned To</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Last Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsSheetOpen(true);
                        }}
                        className="table-row hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5 font-medium text-white">
                          {lead.name}
                        </td>
                        <td className="px-5 py-3.5 text-white/60 font-mono">
                          {lead.phone}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {(lead.assignedToName || 'E').charAt(0)}
                            </div>
                            <span className="text-white/90">{lead.assignedToName || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`status-badge border ${getStatusBadgeClass(lead.status)}`}>
                            ● {lead.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right text-white/40 text-[11px]">
                          {new Date(lead.lastActionAt || lead.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-white/40">
              <span>Showing {paginatedLeads.length} of {filteredLeads.length} active leads</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
                >
                  Prev
                </button>
                <span className="text-white">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Screenshot Dump Modal */}
      <UploadDumpModal
        isOpen={isDumpModalOpen}
        onClose={() => setIsDumpModalOpen(false)}
        onSuccess={(summary) => {
          refreshData();
          setToastMessage(summary);
          setTimeout(() => setToastMessage(null), 6000);
        }}
      />

      {/* Lead Detail / History Drawer */}
      <LeadResponseSheet
        lead={selectedLead}
        currentUser={currentUser}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedLead(null);
        }}
        onLeadUpdated={refreshData}
      />
    </div>
  );
};
