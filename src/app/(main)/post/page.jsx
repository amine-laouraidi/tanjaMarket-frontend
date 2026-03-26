import { authFetch } from "@/lib/authFetch";
import PostAdForm from "@/components/PostAdForm";

export default async function PostAdPage() {
  const [categoriesRes, subcategoriesRes, meRes] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/categories`),
    fetch(`${process.env.BACKEND_URL}/subcategories`),
    authFetch("/users/me"),
  ]);

  const categories = await categoriesRes.json();
  const subcategories = await subcategoriesRes.json();
  const me = meRes.ok ? await meRes.json() : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <PostAdForm
        categories={categories}
        subcategories={subcategories}
        defaultPhone={me?.phone ?? ""}
      />
    </main>
  );
}