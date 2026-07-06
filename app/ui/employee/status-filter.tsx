'use client';

export default function StatusFilter({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="status"
      defaultValue={defaultValue}
      onChange={(e) => e.target.form?.submit()}
      className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
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
  );
}
