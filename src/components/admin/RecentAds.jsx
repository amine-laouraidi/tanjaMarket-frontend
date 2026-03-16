import { RiCheckLine, RiDeleteBinLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ads = [
  { id: 1, title: "Apt Maarif 3ch", user: "sara@mail.com", status: "active" },
  { id: 2, title: "Villa Tanger 5ch", user: "karim@mail.com", status: "pending" },
  { id: 3, title: "Studio Rabat", user: "lina@mail.com", status: "active" },
  { id: 4, title: "Bureau Casa", user: "omar@mail.com", status: "inactive" },
  { id: 5, title: "Riad Fès 4ch", user: "youssef@mail.com", status: "pending" },
];

const statusStyle = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function RecentAds() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-medium text-gray-800">Recent ads</h3>
        <span className="text-[11px] text-emerald-600 cursor-pointer hover:underline">View all →</span>
      </div>

      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-gray-400 font-normal pb-2 pr-3">Title</th>
            <th className="text-left text-gray-400 font-normal pb-2 pr-3">User</th>
            <th className="text-left text-gray-400 font-normal pb-2 pr-3">Status</th>
            <th className="text-left text-gray-400 font-normal pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 pr-3 text-gray-800 font-medium">{ad.title}</td>
              <td className="py-2.5 pr-3 text-gray-400">{ad.user}</td>
              <td className="py-2.5 pr-3">
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", statusStyle[ad.status])}>
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </span>
              </td>
              <td className="py-2.5">
                <div className="flex gap-1">
                  <Button className="w-[22px] h-[22px] rounded border border-gray-100 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                    <RiCheckLine size={11} className="text-gray-400 hover:text-emerald-600" />
                  </Button>
                  <Button className="w-[22px] h-[22px] rounded border border-gray-100 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                    <RiDeleteBinLine size={11} className="text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
