"use server";

import { authFetch } from "@/lib/authFetch";

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
