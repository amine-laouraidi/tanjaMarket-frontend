import SavedPageClient from "@/components/SavedPageClient";
import { authFetch } from "@/lib/authFetch";

export const metadata = { title: "Mes favoris | TanjaMarket" };

export default async function SavedPage() {
  const res = await authFetch("/saved");
  const ads = res ? await res.json() : null;
  return <SavedPageClient initialAds={ads.data} />;
}