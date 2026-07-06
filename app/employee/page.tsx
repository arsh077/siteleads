import { redirect } from 'next/navigation';
import { requireEmployee } from '../lib/dal';

export default async function EmployeeHome() {
  await requireEmployee();
  redirect('/employee/leads');
}
