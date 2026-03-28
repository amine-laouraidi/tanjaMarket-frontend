import { RiFileListLine, RiTimeLine, RiUserLine, RiUserForbidLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total ads",
    value: "347",
    sub: "+14 this week",
    trend: "up",
    icon: RiFileListLine,
    color: "emerald",
  },
  // {
  //   label: "Pending review",
  //   value: "5",
  //   sub: "needs action",
  //   trend: "warn",
  //   icon: RiTimeLine,
  //   color: "amber",
  // },
  {
    label: "Total users",
    value: "1,284",
    sub: "+32 this month",
    trend: "up",
    icon: RiUserLine,
    color: "blue",
  },
  {
    label: "Banned users",
    value: "12",
    sub: "3 this week",
    trend: "down",
    icon: RiUserForbidLine,
    color: "red",
  },
];

const trendClass = {
  up: "text-emerald-600",
  down: "text-red-500",
  warn: "text-amber-500",
};

const iconBg = {
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  red: "bg-red-50 text-red-500",
};

export default function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, sub, trend, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3"
        >
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", iconBg[color])}>
            <Icon size={16} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">{label}</p>
            <p className="text-[20px] font-semibold text-gray-900 leading-none">{value}</p>
            <p className={cn("text-[11px] mt-1", trendClass[trend])}>{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
