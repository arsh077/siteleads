'use client';

import { useTransition } from 'react';
import { toggleEmployeeStatusAction } from '../../actions/admin-employees';
import { Power } from 'lucide-react';

interface EmployeeStatusToggleProps {
  userId: string;
  isActive: boolean;
}

export default function EmployeeStatusToggle({ userId, isActive }: EmployeeStatusToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleEmployeeStatusAction(userId);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`status-badge border transition-all cursor-pointer inline-flex items-center gap-1 ${
        isActive
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
          : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
      } disabled:opacity-50`}
    >
      <Power className={`w-3 h-3 ${isPending ? 'animate-pulse' : ''}`} />
      <span>{isActive ? 'Active (Receiving Leads)' : 'Inactive (Skipped)'}</span>
    </button>
  );
}
