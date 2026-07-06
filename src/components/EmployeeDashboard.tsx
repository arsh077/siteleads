import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, User } from '../types';
import { getLeads } from '../services/storage';
import { LeadResponseSheet } from './LeadResponseSheet';
import { 
  FileSpreadsheet, 
  Search, 
  PhoneCall, 
  Clock, 
  CheckCircle, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Phone, 
  Mail,
  UserCheck
} from 'lucide-react';

interface EmployeeDashboardProps {
  currentUser: User;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ currentUser }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const refreshLeads = () => {
    const allLeads = getLeads();
    const myLeads = allLeads.filter((l) => l.assignedToId === currentUser.id);
    setLeads(myLeads);
  };

  useEffect(() => {
    refreshLeads();
  }, [currentUser]);

  // Stat Counters
  const totalMyLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const followUpCount = leads.filter((l) => l.status === 'Follow Up' || l.status === 'Called').length;
  const convertedCount = leads.filter((l) => l.status === 'Converted' || l.status === 'Interested').length;

  // Filter & Search
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.notes && l.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : l.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenSheet = (lead: Lead) => {
    setSelectedLead(lead);
    setIsSheetOpen(true);
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      
      {/* Welcome & Stat Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 sm:p-6 border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Hello, {currentUser.name}! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Welcome to your assigned lead response sheet. Keep notes updated after every client interaction.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <p className="text-[10px] uppercase text-white/40 font-semibold">Total Assigned</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalMyLeads}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <p className="text-[10px] uppercase text-blue-400 font-semibold">New Uncontacted</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-300">{newLeadsCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <p className="text-[10px] uppercase text-amber-400 font-semibold">Follow Ups</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-300">{followUpCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-[10px] uppercase text-emerald-400 font-semibold">Interested / Sales</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-300">{convertedCount}</p>
          </div>
        </div>
      </div>

      {/* Main Leads Master Response Sheet Card */}
      <div className="glass-panel flex flex-col border border-white/10 overflow-hidden shadow-xl">
        
        {/* Table Controls Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-white text-base">
              My Assigned Leads Response Sheet
            </h2>
            <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-mono">
              {filteredLeads.length} items
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search name or phone..."
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500 w-full sm:w-56"
              />
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Called">Called</option>
              <option value="In Progress">In Progress</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Not Interested">Not Interested</option>
            </select>
          </div>
        </div>

        {/* Responsive Table View */}
        <div className="overflow-x-auto">
          {paginatedLeads.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-xs space-y-2">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-white/20 mb-2" />
              <p>No leads found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-white/40 border-b border-white/10">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Lead Name</th>
                  <th className="px-5 py-3.5 font-medium">Contact Number</th>
                  <th className="px-5 py-3.5 font-medium">Current Status</th>
                  <th className="px-5 py-3.5 font-medium">Latest Remark</th>
                  <th className="px-5 py-3.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleOpenSheet(lead)}
                    className="table-row hover:bg-white/10 transition-colors cursor-pointer group"
                  >
                    {/* Lead Name */}
                    <td className="px-5 py-4 font-semibold text-white group-hover:text-blue-300">
                      <div>
                        <span>{lead.name}</span>
                        <p className="text-[10px] font-normal text-white/40">{lead.source || 'Screenshot Dump'}</p>
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className="px-5 py-4 font-mono text-white/80">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-400" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4">
                      <span className={`status-badge border ${getStatusBadgeClass(lead.status)}`}>
                        ● {lead.status}
                      </span>
                    </td>

                    {/* Latest Remark */}
                    <td className="px-5 py-4 text-white/60 max-w-xs truncate">
                      {lead.notes || 'No notes added yet'}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSheet(lead);
                        }}
                        className="btn-primary text-xs px-3.5 py-1.5 rounded-lg font-medium text-white shadow inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        Log Response
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-white/50">
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredLeads.length} total leads)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Response Sheet Drawer Modal */}
      <LeadResponseSheet
        lead={selectedLead}
        currentUser={currentUser}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedLead(null);
        }}
        onLeadUpdated={refreshLeads}
      />
    </div>
  );
};
