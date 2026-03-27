import { authFetch } from "@/lib/authFetch";
import NewCategoryClient from "@/components/admin/NewCategoryClient";

export const metadata = { title: "Category — TanjaMarket Admin" };

async function getCategoryFull(id) {
  const res = await authFetch(`/categories/${id}/full`, { cache: "no-store" });
  if (!res || !res.ok) return null;
  
  return  res.json();
}

export default async function CategoryFormPage({ searchParams }) {
  const params = await searchParams;
  const isEdit = params?.action === "edit";
  const defaultValues = isEdit && params?.id ? await getCategoryFull(params.id) : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[18px] font-semibold text-gray-900">
          {isEdit ? "Edit category" : "Add category"}
        </h1>
        <p className="text-[13px] text-gray-400 mt-0.5">
          {isEdit
            ? "Update category details, subcategories and fields"
            : "Create a category, add subcategories, then define their fields"}
        </p>
      </div>

      <NewCategoryClient defaultValues={defaultValues} edit={isEdit} />
    </div>
  );
}