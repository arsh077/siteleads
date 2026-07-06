import { requireAdmin } from '../../../lib/dal';
import { getUsers } from '../../../lib/db';
import Navbar from '../../../ui/navbar';
import EmployeeEditForm from './edit-form';
import { ArrowLeft, UserCog } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEmployeePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  const users = getUsers();
  const emp = users.find((u) => u.id === id && u.role === 'employee');

  if (!emp) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Navbar activeTab="employees" />

      <main className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Back navigation link */}
        <Link
          href="/admin/employees"
          className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employee Management
        </Link>

        {/* Header Title block */}
        <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-2">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCog className="w-5 h-5 text-blue-400" />
            Edit Employee Credentials
          </h1>
          <p className="text-xs text-white/60">
            Modify login parameters and update passwords for <strong>{emp.name}</strong>.
          </p>
        </div>

        {/* Interactive form client component wrapper */}
        <EmployeeEditForm employee={emp} />

      </main>
    </div>
  );
}
