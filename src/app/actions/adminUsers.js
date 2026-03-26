"use server";

import { authFetch } from "@/lib/authFetch";
import { revalidatePath } from "next/cache";

export async function banUserAction(prevState, formData) {
  const userId = formData.get("userId");
  const status = formData.get("status");

  try {
    const res = await authFetch(`/admin/users/${userId}/ban`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });

    if (!res || !res.ok) {
      const err = await res?.json().catch(() => ({}));
      return { success: false, error: err?.message || "Failed to update user status" };
    }

    revalidatePath("/admin/users");
    return { success: true, message: `User status updated to "${status}"` };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function deleteUserAction(prevState, formData) {
  const userId = formData.get("userId");

  try {
    const res = await authFetch(`/admin/users/${userId}`, {
      method: "DELETE",
    });

    if (!res || !res.ok) {
      const err = await res?.json().catch(() => ({}));
      return { success: false, error: err?.message || "Failed to delete user" };
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User and all their ads deleted" };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}