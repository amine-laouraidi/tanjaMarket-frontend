"use client";

import { useState } from "react";
import CategoryForm from "@/components/admin/CategoryForm";
import SubcategoryForm from "@/components/admin/SubcategoryForm";
import FieldForm from "@/components/admin/FieldForm";
import { cn } from "@/lib/utils";

function Section({ step, title, description, locked, children }) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border shadow-sm overflow-hidden transition-opacity",
        locked
          ? "border-gray-100 opacity-50 pointer-events-none"
          : "border-gray-200",
      )}
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0",
            locked ? "bg-gray-100 text-gray-400" : "bg-emerald-600 text-white",
          )}
        >
          {step}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-800">{title}</p>
          <p className="text-[12px] text-gray-400">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function NewCategoryClient({ defaultValues, edit }) {
  const [category, setCategory] = useState(defaultValues?.category ?? null);
  const [subcategories, setSubcategories] = useState(
    defaultValues?.subcategories ?? [],
  );

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <Section step={1} title="Category" description="Name and icon">
        <CategoryForm category={category} edit={edit} onCreated={setCategory} />
      </Section>

      <Section
        step={2}
        title="Subcategories"
        description="Add subcategories to this category"
        locked={!category}
      >
        <SubcategoryForm
          categoryId={category?._id}
          subcategories={subcategories}
          onCreated={(sub) => setSubcategories((prev) => [...prev, sub])}
          onDeleted={(id) =>
            setSubcategories((prev) => prev.filter((s) => s._id !== id))
          }
          locked={!category}
        />
      </Section>

      <Section
        step={3}
        title="Field templates"
        description="Add custom fields per subcategory"
        locked={subcategories.length === 0}
      >
        <FieldForm
          subcategories={subcategories}
          locked={subcategories.length === 0}
          edit={edit}
        />
      </Section>
    </div>
  );
}
