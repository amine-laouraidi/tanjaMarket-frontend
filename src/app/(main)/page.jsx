import SearchFilter from "@/components/SearchFilter";
import ListingsGrid from "@/components/ListingsGrid";

export default async function Home({ searchParams }) {
  const [categoriesRes, subcategoriesRes] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/categories`),
    fetch(`${process.env.BACKEND_URL}/subcategories`),
  ]);
  
  const categories = await categoriesRes.json();
  const subcategories = await subcategoriesRes.json();
  const filters = await searchParams;
  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      <SearchFilter categories={categories} subcategories={subcategories}/>
      <ListingsGrid filters={filters} />
    </main>
  );
}
