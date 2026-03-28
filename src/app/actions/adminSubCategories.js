"use server";

import { authFetch } from "@/lib/authFetch";

// ─── Subcategory ──────────────────────────────────────────────────────────────
export async function createSubcategoryAction(prevState, formData) {
  const name = formData.get("name");
  const categoryId = formData.get("categoryId");

  if (!name?.trim())
    return { success: false, error: "Subcategory name is required" };

  try {
    const res = await authFetch("/subcategories", {
      method: "POST",
      body: JSON.stringify({ name: name.trim(), category: categoryId }),
    });
    const json = await res?.json().catch(() => ({}));
    if (!res || !res.ok)
      return {
        success: false,
        error: json?.error || "Failed to create subcategory",
      };

    return {
      success: true,
      message: "Subcategory added",
      subcategory: json.data,
    };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}


export async function deleteSubcategoryAction(prevState, formData) {
  const id = formData.get("id");

  try {
    const res = await authFetch(`/subcategories/${id}`, { method: "DELETE" });

    const json = await res?.json().catch(() => ({}));

    if (!res || !res.ok)
      return {
        success: false,
        error: json?.error || "Failed to delete subcategory",
      };

    return { success: true, message: "Subcategory deleted", id };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}