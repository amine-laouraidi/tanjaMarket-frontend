import { authFetch } from "@/lib/authFetch";
import BanUserButton from "@/components/admin/BanUserButton";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import { RiUserLine, RiUserForbidLine, RiTimeLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

async function getUsers(filters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.page) params.set("page", filters.page);

  const res = await authFetch(`/admin/users?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res || !res.ok) return { data: [], pagination: { total: 0, page: 1, pages: 1 } };
  return res.json();
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    banned: "bg-red-50 text-red-600 border-red-200",
    suspended: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const icons = {
    active: <RiUserLine size={10} />,
    banned: <RiUserForbidLine size={10} />,
    suspended: <RiTimeLine size={10} />,
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border", styles[status])}>
      {icons[status]}
      {status}
    </span>
  );
}

export default async function UsersTable({ filters }) {
  const { data: users, pagination } = await getUsers(filters);

  if (!users.length) {
    return (
      <p className="text-[13px] text-gray-400 py-8 text-center">No users found.</p>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {["User", "Phone", "Ads", "Status", "Joined", "Actions"].map((h) => (
                <th
                  key={h}
                  className={cn(
                    "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400",
                    h === "Actions" ? "text-right" : "text-left"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                {/* User */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 leading-tight">{user.fullName}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>
                {/* Phone */}
                <td className="px-4 py-3 text-gray-500 text-[12px]">{user.phone ?? "—"}</td>
                {/* Ads */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-[11px] font-semibold">
                    {user.adsCount}
                  </span>
                </td>
                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>
                {/* Joined */}
                <td className="px-4 py-3 text-gray-400 text-[12px]">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <BanUserButton userId={user._id} currentStatus={user.status} />
                    <DeleteUserButton userId={user._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-[12px] text-gray-400 bg-gray-50/40">
          <span>Page {pagination.page} of {pagination.pages}</span>
          <span>{pagination.total} total users</span>
        </div>
      )}
    </div>
  );
}