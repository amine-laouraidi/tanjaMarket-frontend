"use server";

import { authFetch } from "@/lib/authFetch";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(prevState, formData) {
  const name = formData.get("name");
  const icon = formData.get("icon");

  if (!name?.trim()) return { success: false, error: "Category name is required" };

  try {
    const res = await authFetch("/categories", {
      method: "POST",
      body: JSON.stringify({ name: name.trim(), icon: icon?.trim() || undefined }),
    });

    const json = await res?.json().catch(() => ({}));

    if (!res || !res.ok) {
      return { success: false, error: json?.message || "Failed to create category" };
    }

    revalidatePath("/admin/categories");
    return { success: true, message: "Category created", category: json.data };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function createSubcategoryAction(prevState, formData) {
  const name = formData.get("name");
  const categoryId = formData.get("categoryId");

  if (!name?.trim()) return { success: false, error: "Subcategory name is required" };

  try {
    const res = await authFetch("/subcategories", {
      method: "POST",
      body: JSON.stringify({ name: name.trim(), category: categoryId }),
    });

    const json = await res?.json().catch(() => ({}));

    if (!res || !res.ok) {
      return { success: false, error: json?.message || "Failed to create subcategory" };
    }

    return { success: true, message: "Subcategory created", subcategory: json.data };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function createFieldAction(prevState, formData) {
  const subcategoryId = formData.get("subcategoryId");
  const label = formData.get("label");
  const name = formData.get("name");
  const type = formData.get("type");
  const placeholder = formData.get("placeholder");
  const required = formData.get("required") === "true";
  const optionsRaw = formData.get("options");
  const options = optionsRaw ? optionsRaw.split(",").map((o) => o.trim()).filter(Boolean) : [];

  if (!label?.trim()) return { success: false, error: "Label is required" };
  if (!name?.trim()) return { success: false, error: "Name is required" };
  if (!type) return { success: false, error: "Type is required" };

  try {
    const res = await authFetch("/fields", {
      method: "POST",
      body: JSON.stringify({
        subcategory: subcategoryId,
        label: label.trim(),
        name: name.trim(),
        type,
        placeholder: placeholder?.trim() || "",
        required,
        options,
      }),
    });

    const json = await res?.json().catch(() => ({}));

    if (!res || !res.ok) {
      return { success: false, error: json?.message || "Failed to create field" };
    }

    return { success: true, message: "Field created", field: json.data };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}