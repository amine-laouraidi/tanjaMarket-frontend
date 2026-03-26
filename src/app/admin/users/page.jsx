import UsersFilter from "@/components/admin/UsersFilter";
import UsersTable from "@/components/admin/UsersTable";

export const metadata = { title: "Users — TanjaMarket Admin" };

export default async function AdminUsersPage({ searchParams }) {
  const filters = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[18px] font-semibold text-gray-900">Users</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Manage all registered users</p>
      </div>

      <UsersFilter />
      <UsersTable filters={filters} />
    </div>
  );
}