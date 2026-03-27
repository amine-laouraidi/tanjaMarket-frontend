"use client";

import { useActionState, useEffect } from "react";
import { createSubcategoryAction } from "@/app/actions/adminCatalog";
import { toast } from "sonner";
import { RiAddLine, RiCheckLine } from "react-icons/ri";

export default function SubcategoryForm({ categoryId, subcategories, onCreated, locked }) {
  const [state, action, isPending] = useActionState(createSubcategoryAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      onCreated(state.subcategory);
    } else {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <span key={sub._id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[12px] font-medium">
              <RiCheckLine size={11} />
              {sub.name}
            </span>
          ))}
        </div>
      )}

      <form action={action} className="flex items-end gap-3">
        <input type="hidden" name="categoryId" value={categoryId} />
        <div className="flex-1 space-y-1">
          <label className="text-[12px] font-medium text-gray-600">Subcategory name *</label>
          <input
            key={state?.success ? Date.now() : "sub"}
            name="name"
            placeholder="e.g. Cars"
            required
            disabled={locked}
            className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 disabled:bg-gray-50 transition"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || locked}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <RiAddLine size={14} />
          {isPending ? "Adding..." : "Add"}
        </button>
      </form>
      {state?.error && <p className="text-[12px] text-red-500">{state.error}</p>}
    </div>
  );
}