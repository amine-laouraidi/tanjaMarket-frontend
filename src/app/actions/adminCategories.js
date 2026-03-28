"use server";

import { authFetch } from "@/lib/authFetch";
import { revalidatePath } from "next/cache";

// ─── Category ─────────────────────────────────────────────────────────────────
export async function createCategoryAction(prevState, formData) {
  const name = formData.get("name");
  const icon = formData.get("icon");

  if (!name?.trim())
    return { success: false, error: "Category name is required" };

  try {
    const res = await authFetch("/categories", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        icon: icon?.trim() || undefined,
      }),
    });
    const json = await res?.json().catch(() => ({}));
    if (!res || !res.ok)
      return {
        success: false,
        error: json?.error || "Failed to create category",
      };

    revalidatePath("/admin/categories");
    return { success: true, message: "Category created", category: json.data };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function updateCategoryAction(prevState, formData) {
  const id = formData.get("id");
  const name = formData.get("name");
  const icon = formData.get("icon");

  if (!name?.trim())
    return { success: false, error: "Category name is required" };

  try {
    const res = await authFetch(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: name.trim(),
        icon: icon?.trim() || undefined,
      }),
    });
    const json = await res?.json().catch(() => ({}));
    if (!res || !res.ok)
      return {
        success: false,
        error: json?.error || "Failed to update category",
      };

    revalidatePath("/admin/categories");
    return { success: true, message: "Category updated", category: json.data };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function deleteCategoryAction(prevState, formData) {
  const categoryId = formData.get("categoryId");

  try {
    const res = await authFetch(`/categories/${categoryId}`, {
      method: "DELETE",
    });

    if (!res || !res.ok) {
      const err = await res?.json().catch(() => ({}));
      return {
        success: false,
        error: err?.message || "Failed to delete category",
      };
    }

    revalidatePath("/admin/categories");
    return { success: true, message: "Category deleted" };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}
