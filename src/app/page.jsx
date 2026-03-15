import SearchFilter from "@/components/SearchFilter";
import ListingsGrid from "@/components/ListingsGrid";

export default async function Home({searchParams}) {
  const filters = await searchParams;
  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      <SearchFilter  />
      <ListingsGrid filters={filters} />
    </main>
  );
}