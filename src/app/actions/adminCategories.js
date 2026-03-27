"use server";

import { authFetch } from "@/lib/authFetch";
import { revalidatePath } from "next/cache";

export async function deleteCategoryAction(prevState, formData) {
  const categoryId = formData.get("categoryId");

  try {
    const res = await authFetch(`/categories/${categoryId}`, {
      method: "DELETE",
    });

    if (!res || !res.ok) {
      const err = await res?.json().catch(() => ({}));
      return { success: false, error: err?.message || "Failed to delete category" };
    }

    revalidatePath("/admin/categories");
    return { success: true, message: "Category deleted" };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}