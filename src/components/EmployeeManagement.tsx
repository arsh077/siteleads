import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  getUsers, 
  createEmployee, 
  toggleUserStatus, 
  updateUserCredentials, 
  getLeads 
} from '../services/storage';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  UserCheck, 
  Power, 
  KeyRound, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  Sparkles,
  BarChart2
} from 'lucide-react';

export const EmployeeManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [leadCounts, setLeadCounts] = useState<Record<string, number>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = () => {
    const allUsers = getUsers();
    setUsers(allUsers);

    const leads = getLeads();
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      if (l.assignedToId) {
        counts[l.assignedToId] = (counts[l.assignedToId] || 0) + 1;
      }
    });
    setLeadCounts(counts);
  };

  useEffect(() => {
    loadData();
  }, []);

  const employees = users.filter((u) => u.role === 'employee');

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !username.trim() || !password.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      createEmployee(name.trim(), username.trim(), password.trim());
      setSuccess(`Employee account for "${name.trim()}" created successfully!`);
      setName('');
      setUsername('');
      setPassword('123');
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create employee');
    }
  };

  const handleToggleStatus = (userId: string) => {
    try {
      toggleUserStatus(userId);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setUsername(user.username);
    setPassword('');
    setError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      updateUserCredentials(editingUser.id, name, username, password || undefined);
      setSuccess(`Updated details for ${editingUser.name}`);
      setEditingUser(null);
      setName('');
      setUsername('');
      setPassword('123');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update credentials');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 sm:p-6 border border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Employee Management
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Create, manage credentials, and toggle active status for equal lead distribution.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddModalOpen(true);
            setError(null);
            setName('');
            setUsername('');
            setPassword('123');
          }}
          className="btn-primary px-4 py-2.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add New Employee
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 font-bold">×</button>
        </div>
      )}

      {/* Employee List Grid/Table */}
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
                      <button
                        onClick={() => handleToggleStatus(emp.id)}
                        className={`status-badge border transition-all cursor-pointer ${
                          emp.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {emp.isActive ? 'Active (Receiving Leads)' : 'Inactive (Skipped)'}
                      </button>
                    </td>

                    <td className="px-5 py-4 font-bold text-blue-300 font-mono">
                      {count} Lead(s)
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(emp)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        Edit / Reset Password
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 border border-white/10 shadow-2xl space-y-4 bg-[#0F172A]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-semibold text-white text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Add New Employee Account
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-white/70 mb-1">Full Employee Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-white/70 mb-1">Username (Login ID)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. vikram"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-white/70 mb-1">Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. 123456"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-lg text-white font-semibold cursor-pointer"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Credentials Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 border border-white/10 shadow-2xl space-y-4 bg-[#0F172A]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-semibold text-white text-base flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-400" />
                Edit Credentials - {editingUser.name}
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-white/70 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-white/70 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-white/70 mb-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-lg text-white font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
