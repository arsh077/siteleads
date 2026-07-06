'use client';

import { useActionState } from 'react';
import { createEmployeeAction } from '../../actions/admin-employees';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const initialState = {
  error: '',
  success: ''
};

export default function EmployeeForm() {
  const [state, action, pending] = useActionState(createEmployeeAction, initialState);

  return (
    <div className="glass-panel p-6 border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <UserPlus className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold text-white text-sm">Add New Employee Account</h3>
      </div>

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

      <form action={action} className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-white/70 mb-1">Full Employee Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Vikram Rathore"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-white/70 mb-1">Username (Login ID)</label>
          <input
            type="text"
            name="username"
            placeholder="e.g. vikram"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div>
          <label className="block font-medium text-white/70 mb-1">Password</label>
          <input
            type="text"
            name="password"
            defaultValue="123"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full btn btn-primary py-2.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
        >
          {pending ? 'Registering employee...' : 'Create Employee Account'}
        </button>
      </form>
    </div>
  );
}
