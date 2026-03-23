"use server";

import { revalidatePath } from "next/cache";
import { authFetch } from "@/lib/authFetch";
import { updateProfileSchema, updatePasswordSchema } from "@/lib/UserValidationSchemas";

export async function updateProfile(prevState, formData) {
  const result = updateProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      success: false,
      error: errors.fullName?.[0] ?? errors.phone?.[0],
    };
  }

  try {
    const res = await authFetch("/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    if (!res || !res.ok) {
      const data = await res?.json().catch(() => ({}));
      return { success: false, error: data?.message || "Erreur lors de la mise à jour." };
    }

    revalidatePath("/profile");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Erreur réseau. Réessayez." };
  }
}

export async function updatePassword(prevState, formData) {
  const result = updatePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formErrors = result.error.flatten().formErrors;
    return {
      success: false,
      error:
        errors.currentPassword?.[0] ??
        errors.newPassword?.[0] ??
        errors.confirmPassword?.[0] ??
        formErrors?.[0],
    };
  }

  try {
    const res = await authFetch("/users/me/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      }),
    });

    if (!res || !res.ok) {
      const data = await res?.json().catch(() => ({}));
      return { success: false, error: data?.message || "Mot de passe actuel incorrect." };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Erreur réseau. Réessayez." };
  }
}