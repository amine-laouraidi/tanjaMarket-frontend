import AdCard from "./AdCard";
import Pagination from "./Pagination";
import { authFetch } from "@/lib/authFetch";

export default async function ListingsGrid({ filters }) {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.subcategory) params.set("subcategory", filters.subcategory);
  if (filters?.quartier) params.set("quartier", filters.quartier);
  if (filters?.minPrice) params.set("minPrice", filters.minPrice);
  if (filters?.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters?.page) params.set("page", filters.page);

  const [adsRes, savedRes] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/ads?${params.toString()}`, { cache: "no-store" }),
    authFetch("/saved/ids"),
  ]);

  if (!adsRes.ok) return <p className="text-sm text-muted-foreground">Erreur de chargement.</p>;

  const json = await adsRes.json();
  const ads = json.data ?? [];

  const savedIds = savedRes?.ok ? (await savedRes.json()).ids : [];
  const savedSet = new Set(savedIds);

  if (!ads.length) {
    return <p className="text-sm text-muted-foreground">Aucune annonce trouvée.</p>;
  }

  return (
    <div>
      <p className="text-sm font-medium mb-3">
        {json.pagination.total} annonces trouvées
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ads.map((ad) => (
          <AdCard key={ad._id} ad={ad} initialSaved={savedSet.has(ad._id)} />
        ))}
      </div>
      <Pagination pagination={json.pagination} />
    </div>
  );
}