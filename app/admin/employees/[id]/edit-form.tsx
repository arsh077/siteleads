'use client';

import { useActionState } from 'react';
import { updateEmployeeAction } from '../../../actions/admin-employees';
import { ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../../../lib/db';

interface EmployeeEditFormProps {
  employee: User;
}

const initialState = {
  error: '',
  success: ''
};

export default function EmployeeEditForm({ employee }: EmployeeEditFormProps) {
  const [state, action, pending] = useActionState(updateEmployeeAction, initialState);

  return (
    <div className="glass-panel p-6 border border-white/10 shadow-xl space-y-4">
      
      {state.error && (
        <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
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
        <input type="hidden" name="id" value={employee.id} />

        <div>
          <label className="block font-medium text-white/70 mb-1">Full Employee Name</label>
          <input
            type="text"
            name="name"
            defaultValue={employee.name}
            required
            className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-white/70 mb-1">Username (Login ID)</label>
          <input
            type="text"
            name="username"
            defaultValue={employee.username}
            required
            className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div>
          <label className="block font-medium text-white/70 mb-1">
            New Password <span className="text-white/30 font-normal">(Leave blank to keep current)</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter new account password..."
            className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full btn btn-primary py-2.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
        >
          {pending ? 'Saving Changes...' : 'Save Account Credentials'}
        </button>
      </form>
    </div>
  );
}
