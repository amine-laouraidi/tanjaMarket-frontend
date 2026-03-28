import AdsFilter from "@/components/admin/AdsFilter";
import AdsTable from "@/components/admin/AdsTable";
import { authFetch } from "@/lib/authFetch";

export const metadata = { title: "Ads — TanjaMarket Admin" };

async function getAds(filters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.user) params.set("user", filters.user);
  if (filters?.subcategory) params.set("subcategory", filters.subcategory);
  if (filters?.page) params.set("page", filters.page);

  const res = await authFetch(`/admin/ads?${params.toString()}`, { cache: "no-store" });
  if (!res || !res.ok) return { data: [], pagination: { total: 0, page: 1, pages: 1 } };
  return res.json();
}

async function getCategoriesAndSubs() {
  const [categoriesRes, subcategoriesRes] = await Promise.all([
    authFetch("/categories", { cache: "no-store" }),
    authFetch("/subcategories", { cache: "no-store" }),
  ]);
  const categories = categoriesRes?.ok ? await categoriesRes.json() : [];
  const subcategories = subcategoriesRes?.ok ? await subcategoriesRes.json() : [];
  return { categories, subcategories };
}

export default async function AdminAdsPage({ searchParams }) {
  const filters = await searchParams;
  const [{ data: ads, pagination }, { categories, subcategories }] = await Promise.all([
    getAds(filters),
    getCategoriesAndSubs(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[18px] font-semibold text-gray-900">Ads</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">{pagination.total} ads total</p>
      </div>
      <AdsFilter categories={categories} subcategories={subcategories} />
      <AdsTable ads={ads} pagination={pagination} />
    </div>
  );
}