"use server";
 
import { authFetch } from "@/lib/authFetch";
import { revalidatePath } from "next/cache";
 
export async function deleteAd(adId) {
  const res = await authFetch(`/ads/${adId}`, { method: "DELETE" });
  if (!res || !res.ok) throw new Error("Erreur lors de la suppression");
  revalidatePath("/profile/ads");
}
 