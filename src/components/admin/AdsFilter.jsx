"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RiFilterLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

const STATUSES = ["all", "published", "pending", "rejected", "sold", "expired"];

export default function AdsFilter({ categories, subcategories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "all";
  const currentCategory = searchParams.get("category") ?? "";
  const currentSubcategory = searchParams.get("subcategory") ?? "";

  const update = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // reset subcategory when category changes
    if (key === "category") params.delete("subcategory");
    params.delete("page");
    router.push(`/admin/ads?${params.toString()}`);
  };

  const filteredSubs = subcategories.filter(
    (s) => s.category?._id === currentCategory
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status tabs */}
      <div className="flex items-center gap-1.5">
        <RiFilterLine size={13} className="text-gray-400" />
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => update("status", s === "all" ? "" : s)}
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

      {/* Category select */}
      <select
        value={currentCategory}
        onChange={(e) => update("category", e.target.value)}
        className="px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
           {c.name}
          </option>
        ))}
      </select>

      {/* Subcategory select */}
      <select
        value={currentSubcategory}
        onChange={(e) => update("subcategory", e.target.value)}
        disabled={!currentCategory}
        className="px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 disabled:bg-gray-50 disabled:text-gray-400 transition"
      >
        <option value="">All subcategories</option>
        {filteredSubs.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}