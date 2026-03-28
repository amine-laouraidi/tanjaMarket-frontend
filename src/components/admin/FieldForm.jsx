"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createFieldAction,
  deleteFieldAction,
} from "@/app/actions/adminField";
import { toast } from "sonner";
import { RiAddLine, RiCheckLine, RiDeleteBinLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

const FIELD_TYPES = [
  "text",
  "number",
  "select",
  "multiselect",
  "boolean",
  "date",
];

export default function FieldForm({ subcategories, locked }) {
  const [selectedSub, setSelectedSub] = useState(subcategories[0]?._id ?? "");
  const [fieldsBySub, setFieldsBySub] = useState(
    subcategories.reduce((acc, sub) => {
      acc[sub._id] = sub.fields ?? [];
      return acc;
    }, {}),
  );
  const [showOptions, setShowOptions] = useState(false);

  const [createState, createAction, isCreating] = useActionState(
    createFieldAction,
    null,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteFieldAction,
    null,
  );

  useEffect(() => {
    if (!selectedSub && subcategories[0]) setSelectedSub(subcategories[0]._id);
  }, [subcategories]);

  useEffect(() => {
    if (!createState) return;
    if (createState.success) {
      toast.success(createState.message);
      setFieldsBySub((prev) => ({
        ...prev,
        [selectedSub]: [...(prev[selectedSub] ?? []), createState.field],
      }));
    } else {
      toast.error(createState.error);
    }
  }, [createState]);

  useEffect(() => {
    if (!deleteState) return;
    if (deleteState.success) {
      toast.success(deleteState.message);
      setFieldsBySub((prev) => ({
        ...prev,
        [deleteState.subcategoryId]: prev[deleteState.subcategoryId].filter(
          (f) => f._id !== deleteState.id,
        ),
      }));
    } else {
      toast.error(deleteState.error);
    }
  }, [deleteState]);

  const currentFields = fieldsBySub[selectedSub] ?? [];

  return (
    <div className="space-y-4">
      {/* Subcategory tabs */}
      <div className="flex flex-wrap gap-2">
        {subcategories.map((sub) => (
          <button
            key={sub._id}
            type="button"
            onClick={() => setSelectedSub(sub._id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors",
              selectedSub === sub._id
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50",
            )}
          >
            {sub.name}
            {fieldsBySub[sub._id]?.length ? (
              <span className="ml-1 opacity-75 text-[10px]">
                ({fieldsBySub[sub._id].length})
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Existing fields for selected sub */}
      {currentFields.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentFields.map((f) => (
            <span
              key={f._id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[12px]"
            >
              <RiCheckLine size={11} className="text-emerald-500" />
              {f.label} <span className="text-gray-400">({f.type})</span>
              {f.required && (
                <span className="text-red-400 font-bold text-[10px]">*</span>
              )}
              <form action={deleteAction}>
                <input type="hidden" name="id" value={f._id} />
                <input type="hidden" name="subcategoryId" value={selectedSub} />
                <button
                  type="submit"
                  disabled={isDeleting || locked}
                  className="ml-0.5 text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                >
                  <RiDeleteBinLine size={11} />
                </button>
              </form>
            </span>
          ))}
        </div>
      )}

      {/* Form */}
      <form action={createAction} className="space-y-4">
        <input type="hidden" name="subcategoryId" value={selectedSub} />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-600">
              Label *
            </label>
            <input
              name="label"
              placeholder="e.g. Brand"
              required
              disabled={locked}
              className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 disabled:bg-gray-50 transition"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-600">
              Field name *
            </label>
            <input
              name="name"
              placeholder="e.g. brand"
              required
              disabled={locked}
              className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 disabled:bg-gray-50 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-600">
              Type *
            </label>
            <select
              name="type"
              required
              disabled={locked}
              onChange={(e) =>
                setShowOptions(
                  ["select", "multiselect"].includes(e.target.value),
                )
              }
              className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 disabled:bg-gray-50 transition"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-600">
              Placeholder
            </label>
            <input
              name="placeholder"
              placeholder="e.g. Select brand…"
              disabled={locked}
              className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 disabled:bg-gray-50 transition"
            />
          </div>
        </div>

        {showOptions && (
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-600">
              Options *{" "}
              <span className="text-gray-400 font-normal">
                (comma separated)
              </span>
            </label>
            <input
              name="options"
              placeholder="Toyota, BMW, Mercedes"
              required
              className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="required"
            name="required"
            value="true"
            className="w-4 h-4 rounded accent-emerald-600"
          />
          <label htmlFor="required" className="text-[12px] text-gray-600">
            Required field
          </label>
        </div>

        {createState?.error && (
          <p className="text-[12px] text-red-500">{createState.error}</p>
        )}

        <button
          type="submit"
          disabled={isCreating || locked}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <RiAddLine size={14} />
          {isCreating ? "Saving..." : "Add field"}
        </button>
      </form>
    </div>
  );
}
