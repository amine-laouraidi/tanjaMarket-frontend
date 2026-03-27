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

// ─── Field ────────────────────────────────────────────────────────────────────
export async function createFieldAction(prevState, formData) {
  const subcategoryId = formData.get("subcategoryId");
  const label = formData.get("label");
  const name = formData.get("name");
  const type = formData.get("type");
  const placeholder = formData.get("placeholder");
  const required = formData.get("required") === "true";
  const options =
    formData
      .get("options")
      ?.split(",")
      .map((o) => o.trim())
      .filter(Boolean) ?? [];

  if (!label?.trim()) return { success: false, error: "Label is required" };
  if (!name?.trim()) return { success: false, error: "Name is required" };

  try {
    const res = await authFetch("/fields", {
      method: "POST",
      body: JSON.stringify({
        subcategory: subcategoryId,
        label: label.trim(),
        name: name.trim(),
        type,
        placeholder,
        required,
        options,
      }),
    });
    const json = await res?.json().catch(() => ({}));
    if (!res || !res.ok)
      return {
        success: false,
        error: json?.error || "Failed to create field",
      };

    return { success: true, message: "Field added", field: json.data };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function deleteFieldAction(prevState, formData) {
  const id = formData.get("id");
  const subcategoryId = formData.get("subcategoryId");

  try {
    const res = await authFetch(`/fields/${id}`, { method: "DELETE" });
    const json = await res?.json().catch(() => ({}));
    if (!res || !res.ok) return { success: false, error: json?.error || "Failed to delete field" };

    return { success: true, message: "Field deleted", id, subcategoryId };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}