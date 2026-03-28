"use server";

import { authFetch } from "@/lib/authFetch";
import { revalidatePath } from "next/cache";

export async function changeAdStatusAction(prevState, formData) {
  const id = formData.get("id");
  const status = formData.get("status");

  try {
    const res = await authFetch(`/admin/ads/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    const json = await res?.json().catch(() => ({}));
    if (!res || !res.ok)
      return {
        success: false,
        error: json?.error || "Failed to update status",
      };

    revalidatePath("/admin/ads");
    revalidatePath(`/admin/ads/${id}`);
    return { success: true, message: `Status changed to ${status}`, status };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function bulkDeleteAdsAction(prevState, formData) {
  const ids = formData.get("ids")?.split(",").filter(Boolean);

  try {
    const res = await authFetch("/admin/ads/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
    const json = await res?.json().catch(() => ({}));
    if (!res || !res.ok)
      return { success: false, error: json?.error || "Failed to delete ads" };

    revalidatePath("/admin/ads");
    return { success: true, message: `${json.data.deleted} ads deleted`, ids };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function deleteAdAction(prevState, formData) {
  const id = formData.get("id");
  try {
    const res = await authFetch(`/admin/ads/${id}`, {
      method: "DELETE",
    });
    const json = await res?.json().catch(() => ({}));
    if (!res || !res.ok)
      return { success: false, error: json?.message || "Failed to delete ad" };

    revalidatePath("/admin/ads");
    return { success: true, message: "Ad deleted", id };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}
