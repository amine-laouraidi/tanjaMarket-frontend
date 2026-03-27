import NewCategoryClient from "@/components/admin/NewCategoryClient";

export const metadata = { title: "Add Category — TanjaMarket Admin" };

export default function NewCategoryPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[18px] font-semibold text-gray-900">Add category</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">
          Create a category, add subcategories, then define their fields
        </p>
      </div>
      <NewCategoryClient />
    </div>
  );
}