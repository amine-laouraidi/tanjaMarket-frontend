"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RiSearchLine, RiFilterLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

const STATUSES = ["all", "active", "banned", "suspended"];

export default function UsersFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/users?${params.toString()}`);
  };

  const currentStatus = searchParams.get("status") ?? "all";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search name, email or phone…"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => update("search", e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <RiFilterLine size={13} className="text-gray-400" />
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => update("status", s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-colors",
              currentStatus === s
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}