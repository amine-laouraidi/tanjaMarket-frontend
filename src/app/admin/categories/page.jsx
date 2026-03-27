import { authFetch } from "@/lib/authFetch";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import Link from "next/link";
import { RiAddLine, RiPriceTagLine, RiEditLine } from "react-icons/ri";

export const metadata = { title: "Categories — TanjaMarket Admin" };

async function getCategories() {
  const res = await authFetch("/categories", { cache: "no-store" });
  if (!res || !res.ok) return [];
  return res.json();
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">Categories</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">{categories.length} categories total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 transition-colors"
        >
          <RiAddLine size={15} />
          Add category
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {["Category", "Status", "Created", "Actions"].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${h === "Actions" ? "text-right" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  No categories yet
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Category */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">
                        {cat.icon ?? <RiPriceTagLine size={15} className="text-emerald-500" />}
                      </div>
                      <p className="font-medium text-gray-800">{cat.name}</p>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${cat.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {/* Created */}
                  <td className="px-4 py-3 text-gray-400 text-[12px]">
                    {new Date(cat.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/categories/add?action=edit&id=${cat._id}`}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                      >
                        <RiEditLine size={13} />
                        Edit
                      </Link>
                      <DeleteCategoryButton categoryId={cat._id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}