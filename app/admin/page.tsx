import { requireAdmin } from '../lib/dal';
import { getLeads, getUsers } from '../lib/db';
import { paginateList } from '../lib/pagination';
import Navbar from '../ui/navbar';
import UploadZone from '../ui/admin/upload-zone';
import RedistributeButton from '../ui/admin/redistribute-button';
import { Users as UsersIcon, FileSpreadsheet, Search } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const adminUser = await requireAdmin();
  const params = await searchParams;

  const searchQuery = params.query || '';
  const currentPage = params.page ? parseInt(params.page) : 1;

  const leads = getLeads();
  const users = getUsers();

  const activeEmployees = users.filter((u) => u.role === 'employee' && u.isActive);
  const allEmployees = users.filter((u) => u.role === 'employee');

  // Distribution Counts per Employee
  const employeeLeadCounts: Record<string, number> = {};
  leads.forEach((l) => {
    if (l.assignedToId) {
      employeeLeadCounts[l.assignedToId] = (employeeLeadCounts[l.assignedToId] || 0) + 1;
    }
  });

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
  const pageSize = 8;
  const paginatedResult = paginateList(filteredLeads, currentPage, pageSize);

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

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        
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
                  <p className="text-[10px] font-semibold text-blue-400 flex items-center gap-1 mt-1">
                    Equal Round-Robin
                  </p>
                </div>
              </div>

              {/* Re-distribute Trigger Component */}
              <RedistributeButton />
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
            
            {/* Top Quick KPI Bar + Screenshot Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
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
                  <UsersIcon className="w-6 h-6" />
                </div>
              </div>

              {/* Upload Card container */}
              <div className="md:col-span-3">
                <UploadZone />
              </div>
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
                  <form method="GET" className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="query"
                      defaultValue={searchQuery}
                      placeholder="Search leads..."
                      className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 w-full"
                    />
                  </form>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto flex-1">
                {paginatedResult.items.length === 0 ? (
                  <div className="p-12 text-center text-white/40 text-xs">
                    No leads found. Use the form above to add a screenshot or paste contact lines.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-white/40 border-b border-white/10">
                      <tr>
                        <th className="px-5 py-3 font-medium">Lead Name</th>
                        <th className="px-5 py-3 font-medium">Contact</th>
                        <th className="px-5 py-3 font-medium">Assigned To</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium text-right">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {paginatedResult.items.map((lead) => (
                        <tr
                          key={lead.id}
                          className="table-row hover:bg-white/10 transition-colors"
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
                            {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Table pagination footer */}
              <div className="p-3.5 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-white/40">
                <span>Showing {paginatedResult.items.length} of {filteredLeads.length} active leads</span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin?query=${searchQuery}&page=${Math.max(1, currentPage - 1)}`}
                    className={`px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-30' : ''}`}
                  >
                    Prev
                  </Link>
                  <span className="text-white">{currentPage}</span>
                  <Link
                    href={`/admin?query=${searchQuery}&page=${Math.min(paginatedResult.totalPages, currentPage + 1)}`}
                    className={`px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded cursor-pointer ${currentPage >= paginatedResult.totalPages ? 'pointer-events-none opacity-30' : ''}`}
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
