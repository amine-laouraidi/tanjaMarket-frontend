import { RiProhibited2Line, RiDeleteBinLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

const users = [
  { id: 1, name: "Sara M.", email: "sara@mail.com", status: "active" },
  { id: 2, name: "Karim B.", email: "karim@mail.com", status: "banned" },
  { id: 3, name: "Lina R.", email: "lina@mail.com", status: "active" },
  { id: 4, name: "Omar T.", email: "omar@mail.com", status: "active" },
];

const statusStyle = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  banned: "bg-red-50 text-red-600 border-red-100",
};

export default function RecentUsers() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-medium text-gray-800">Recent users</h3>
        <span className="text-[11px] text-emerald-600 cursor-pointer hover:underline">
          View all →
        </span>
      </div>

      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-gray-400 font-normal pb-2 pr-3">
              Name
            </th>
            <th className="text-left text-gray-400 font-normal pb-2 pr-3">
              Status
            </th>
            <th className="text-left text-gray-400 font-normal pb-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600 flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                    <p className="text-gray-400 text-[10px]">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-2.5 pr-3">
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border",
                    statusStyle[user.status],
                  )}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </td>
              <td className="py-2.5">
                <div className="flex gap-1">
                  <button className="w-[22px] h-[22px] rounded border border-gray-100 flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
                    <RiDeleteBinLine
                      size={11}
                      className="text-gray-400 hover:text-amber-500"
                    />
                  </button>
                  <button className="w-[22px] h-[22px] rounded border border-gray-100 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                    <RiProhibited2Line
                      size={11}
                      className="text-gray-400 hover:text-amber-500"
                    />{" "}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
