"use client";

import { useActionState, useEffect } from "react";
import { createSubcategoryAction, deleteSubcategoryAction } from "@/app/actions/adminSubCategories";
import { toast } from "sonner";
import { RiAddLine, RiCheckLine, RiDeleteBinLine } from "react-icons/ri";

export default function SubcategoryForm({ categoryId, subcategories, onCreated, onDeleted, locked }) {
  const [createState, createAction, isCreating] = useActionState(createSubcategoryAction, null);
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteSubcategoryAction, null);

  useEffect(() => {
    if (!createState) return;
    if (createState.success) {
      toast.success(createState.message);
      onCreated(createState.subcategory);
    } else {
      toast.error(createState.error);
    }
  }, [createState]);

  useEffect(() => {
    if (!deleteState) return;
    if (deleteState.success) {
      toast.success(deleteState.message);
      onDeleted(deleteState.id);
    } else {
      toast.error(deleteState.error);
    }
  }, [deleteState]);

  return (
    <div className="space-y-4">
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <span key={sub._id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[12px] font-medium">
              <RiCheckLine size={11} />
              {sub.name}
              <form action={deleteAction}>
                <input type="hidden" name="id" value={sub._id} />
                <button
                  type="submit"
                  disabled={isDeleting || locked}
                  className="ml-0.5 text-emerald-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                >
                  <RiDeleteBinLine size={11} />
                </button>
              </form>
            </span>
          ))}
        </div>
      )}

      <form action={createAction} className="flex items-end gap-3">
        <input type="hidden" name="categoryId" value={categoryId} />
        <div className="flex-1 space-y-1">
          <label className="text-[12px] font-medium text-gray-600">Subcategory name *</label>
          <input
            key={createState?.success ? Date.now() : "sub"}
            name="name"
            placeholder="e.g. Cars"
            required
            disabled={locked}
            className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 disabled:bg-gray-50 transition"
          />
        </div>
        <button
          type="submit"
          disabled={isCreating || locked}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <RiAddLine size={14} />
          {isCreating ? "Adding..." : "Add"}
        </button>
      </form>

      {createState?.error && <p className="text-[12px] text-red-500">{createState.error}</p>}
    </div>
  );
}