"use client";

import { useActionState, useEffect } from "react";
import { createCategoryAction } from "@/app/actions/adminCatalog";
import { toast } from "sonner";
import { RiAddLine, RiCheckLine } from "react-icons/ri";

export default function CategoryForm({ onCreated, category }) {
  const [state, action, isPending] = useActionState(createCategoryAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      onCreated(state.category);
    } else {
      toast.error(state.error);
    }
  }, [state]);

  if (category) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-emerald-700">
        <RiCheckLine size={15} />
        <span className="font-medium">{category.icon} {category.name}</span>
        <span className="text-[11px] text-gray-400">created</span>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-gray-600">Name *</label>
          <input
            name="name"
            placeholder="e.g. Vehicles"
            required
            className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-gray-600">Icon (emoji)</label>
          <input
            name="icon"
            placeholder="e.g. "
            className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
          />
        </div>
      </div>
      {state?.error && <p className="text-[12px] text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        <RiAddLine size={14} />
        {isPending ? "Creating..." : "Create category"}
      </button>
    </form>
  );
}