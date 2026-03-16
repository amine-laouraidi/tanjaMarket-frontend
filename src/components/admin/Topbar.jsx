"use client";

import { usePathname } from "next/navigation";
import { RiNotification3Line, RiAddLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const titles = {
  "/admin": "Dashboard",
  "/admin/ads": "All Ads",
  "/admin/ads/pending": "Pending Review",
  "/admin/ads/bulk-delete": "Bulk Delete",
  "/admin/users": "All Users",
  "/admin/users/banned": "Banned Users",
  "/admin/categories": "Categories",
  "/admin/categories/new": "Add Category",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = titles[pathname] || "Admin";

  return (
    <header className="h-[50px] bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0">
      <div className="text-[13px] text-gray-400">
        Admin /{" "}
        <span className="text-gray-800 font-medium">{title}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-[11px]">
          5 ads pending
        </Badge>

        <button className="relative w-8 h-8 rounded-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <RiNotification3Line size={15} className="text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] h-7 px-3 gap-1">
          <RiAddLine size={13} />
          New category
        </Button>
      </div>
    </header>
  );
}
