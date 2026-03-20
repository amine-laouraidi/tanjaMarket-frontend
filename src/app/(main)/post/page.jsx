import PostAdForm from "@/components/PostAdForm";

export default async function PostAdPage() {
  const [categoriesRes, subcategoriesRes] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/categories`),
    fetch(`${process.env.BACKEND_URL}/subcategories`),
  ]);

  const categories = await categoriesRes.json();
  const subcategories = await subcategoriesRes.json();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <PostAdForm
        categories={categories}
        subcategories={subcategories}
      />
    </main>
  );
}
