"use client";

import { useActionState, useEffect } from "react";
import { createCategoryAction, updateCategoryAction } from "@/app/actions/adminCategories";
import { toast } from "sonner";
import { RiCheckLine, RiSaveLine, RiAddLine } from "react-icons/ri";

export default function CategoryForm({ onCreated, category, edit }) {
  const action = edit ? updateCategoryAction : createCategoryAction;
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      if (!edit) onCreated(state.category);
    } else {
      toast.error(state.error);
    }
  }, [state]);

  if (!edit && category) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-emerald-700">
        <RiCheckLine size={15} />
        <span className="font-medium">{category.icon} {category.name}</span>
        <span className="text-[11px] text-gray-400">created</span>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {edit && <input type="hidden" name="id" value={category?._id} />}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-gray-600">Name *</label>
          <input
            name="name"
            placeholder="e.g. Vehicles"
            required
            defaultValue={category?.name ?? ""}
            className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-gray-600">Icon (emoji)</label>
          <input
            name="icon"
            placeholder="e.g. 🚗"
            defaultValue={category?.icon ?? ""}
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
        {edit ? <RiSaveLine size={14} /> : <RiAddLine size={14} />}
        {isPending ? "Saving..." : edit ? "Save changes" : "Create category"}
      </button>
    </form>
  );
}