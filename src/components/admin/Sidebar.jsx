"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiFileListLine,
  RiTimeLine,
  RiDeleteBinLine,
  RiUserLine,
  RiUserForbidLine,
  RiPriceTagLine,
  RiAddLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";

const navItems = [
  {
    section: "Overview",
    links: [{ label: "Dashboard", href: "/admin", icon: RiDashboardLine }],
  },
  {
    section: "Ads",
    links: [
      { label: "All ads", href: "/admin/ads", icon: RiFileListLine },
      // { label: "Pending review", href: "/admin/ads/pending", icon: RiTimeLine },
      // { label: "Bulk delete", href: "/admin/ads/bulk-delete", icon: RiDeleteBinLine },
    ],
  },
  {
    section: "Users",
    links: [
      { label: "All users", href: "/admin/users", icon: RiUserLine },
      // { label: "Banned users", href: "/admin/users/banned", icon: RiUserForbidLine },
    ],
  },
  {
    section: "Categories (catalog)",
    links: [
      { label: "All categories", href: "/admin/categories", icon: RiPriceTagLine },
      { label: "Add category", href: "/admin/categories/add", icon: RiAddLine },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[210px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0 h-full">
      <div className="px-4 py-4 border-b border-gray-100">
        <span className="text-[15px] font-semibold text-gray-900">
          Tanja<span className="text-emerald-600">Market</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((group) => (
          <div key={group.section}>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 px-4 pt-4 pb-1">
              {group.section}
            </p>
            {group.links.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors",
                    active
                      ? "bg-emerald-50 text-emerald-700 font-medium border-l-2 border-emerald-500"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  )}
                >
                  <Icon size={14} className={active ? "text-emerald-600" : "text-gray-400"} />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[11px] font-medium flex-shrink-0">
            A
          </div>
          <div>
            <p className="text-[12px] font-medium text-gray-800">Admin</p>
            <p className="text-[10px] text-gray-400">Super admin</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
          <RiLogoutBoxRLine size={13} />
          Logout
        </button>
      </div>
    </aside>
  );
}
