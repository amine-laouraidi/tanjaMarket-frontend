"use client";

import { useState, useEffect } from "react";
import { RiLoader4Line } from "react-icons/ri";
import FieldTemplate from "./FieldTemplate";

export default function DynamicFields({ subcategoryId, values, onChange, onFieldsLoaded, fieldErrors }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subcategoryId) { setFields([]); onFieldsLoaded?.([]); return; }

    let cancelled = false;
    const fetchFields = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields?subcategory=${subcategoryId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          const sorted = data.sort((a, b) => a.order - b.order);
          setFields(sorted);
          onFieldsLoaded?.(sorted);
        }
      } catch {
        if (!cancelled) setError("Impossible de charger les champs spécifiques");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFields();
    return () => { cancelled = true; };
  }, [subcategoryId]);

  if (!subcategoryId) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3 text-[12px] text-gray-400">
        <RiLoader4Line size={14} className="animate-spin text-blue-500" />
        Chargement des caractéristiques...
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
        {error}
      </p>
    );
  }

  if (!fields.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <hr className="flex-1 border-gray-100" />
        <span className="text-[11px] text-gray-400 font-medium">Caractéristiques</span>
        <hr className="flex-1 border-gray-100" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field._id} className={field.type === "multiselect" ? "col-span-2" : ""}>
            <FieldTemplate
              field={field}
              value={values?.[field.name] ?? ""}
              onChange={(val) => onChange(field.name, val)}
              error={fieldErrors?.[field.name]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}