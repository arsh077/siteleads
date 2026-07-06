import { requireAdmin } from '../../lib/dal';
import { getUsers, getLeads } from '../../lib/db';
import Navbar from '../../ui/navbar';
import EmployeeForm from '../../ui/admin/employee-form';
import EmployeeStatusToggle from '../../ui/admin/employee-status-toggle';
import { Users, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default async function EmployeeManagement() {
  await requireAdmin();

  const users = getUsers();
  const leads = getLeads();

  // Count leads per employee
  const leadCounts: Record<string, number> = {};
  leads.forEach((l) => {
    if (l.assignedToId) {
      leadCounts[l.assignedToId] = (leadCounts[l.assignedToId] || 0) + 1;
    }
  });

  const employees = users.filter((u) => u.role === 'employee');

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Navbar activeTab="employees" />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Page Header */}
        <div className="glass-panel p-5 sm:p-6 border border-white/10">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Employee Management
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Create, manage credentials, and toggle active status for equal lead distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Register Card */}
          <div className="lg:col-span-1">
            <EmployeeForm />
          </div>

          {/* Right Column: Employee List Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel border border-white/10 overflow-hidden shadow-xl">
              <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-400" />
                  Employee Team & Equal Distribution Shares ({employees.length})
                </h2>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded uppercase font-semibold">
                  {employees.filter((e) => e.isActive).length} Active Pool
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-white/5 text-[10px] uppercase text-white/40 border-b border-white/10">
                    <tr>
                      <th className="px-5 py-3.5 font-medium">Employee Name</th>
                      <th className="px-5 py-3.5 font-medium">Username</th>
                      <th className="px-5 py-3.5 font-medium">Distribution Status</th>
                      <th className="px-5 py-3.5 font-medium">Assigned Leads Count</th>
                      <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {employees.map((emp) => {
                      const count = leadCounts[emp.id] || 0;
                      return (
                        <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-4 font-semibold text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center shrink-0">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p>{emp.name}</p>
                              <p className="text-[10px] font-normal text-white/40">Created {new Date(emp.createdAt).toLocaleDateString()}</p>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-mono text-white/80">
                            @{emp.username}
                          </td>

                          <td className="px-5 py-4">
                            <EmployeeStatusToggle userId={emp.id} isActive={emp.isActive} />
                          </td>

                          <td className="px-5 py-4 font-bold text-blue-300 font-mono">
                            {count} Lead(s)
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/admin/employees/${emp.id}`}
                              className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all inline-flex items-center gap-1 cursor-pointer"
                            >
                              Edit Profile
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
