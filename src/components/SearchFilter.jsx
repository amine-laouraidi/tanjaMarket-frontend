"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FiSearch, FiChevronDown, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

const QUARTIERS = [
  "Tous",
  "Tanger",
  "Centre",
  "Malabata",
  "Mesnana",
  "Beni Makada",
  "Gzenaya",
];

export default function SearchFilter({ categories = [], subcategories = [] }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [quartier, setQuartier] = useState("Tous");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  function handleSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCategory) params.set("category", selectedCategory._id);
    if (selectedSubcategory) params.set("subcategory", selectedSubcategory._id);
    if (quartier !== "Tous") params.set("quartier", quartier);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/?${params.toString()}`);
  }

  function handleClear() {
    setQuery("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setQuartier("Tous");
    setMinPrice("");
    setMaxPrice("");
    router.push("/");
  }

  const hasActiveFilters =
    query || selectedCategory || quartier !== "Tous" || minPrice || maxPrice;

  return (
    <div className="bg-secondary border rounded-xl p-4 mb-6">
      {/* Search row */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Rechercher une annonce..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 h-10 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-0"
        />

        {/* Quartier — hidden on mobile, shown in expanded filters */}
        <select
          value={quartier}
          onChange={(e) => setQuartier(e.target.value)}
          className="hidden sm:block h-10 px-3 text-sm border rounded-lg bg-background"
        >
          {QUARTIERS.map((q) => (
            <option key={q}>{q}</option>
          ))}
        </select>

        <Button onClick={handleSearch} className="shrink-0">
          <FiSearch size={15} className="sm:mr-2" />
          <span className="hidden sm:inline">Rechercher</span>
        </Button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap mb-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "h-7 px-3 text-xs rounded-full border transition-colors shrink-0",
            !selectedCategory
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:border-foreground/30",
          )}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() =>
              setSelectedCategory(
                selectedCategory?._id === cat._id ? null : cat,
              )
            }
            className={cn(
              "h-7 px-3 text-xs rounded-full border transition-colors shrink-0 flex items-center gap-1",
              selectedCategory?._id === cat._id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30",
            )}
          >
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Subcategories — appears when category selected */}
      {selectedCategory && (
        <div className="flex gap-2 flex-wrap mb-3 pl-2 border-l-2 border-primary/30">
          { subcategories.length > 0 ? (
            subcategories.filter((sub) => sub.category._id === selectedCategory._id).map((sub) => (
              <button
                key={sub._id}
                onClick={() =>
                  setSelectedSubcategory(
                    selectedSubcategory?._id === sub._id ? null : sub,
                  )
                }
                className={cn(
                  "h-6 px-2.5 text-xs rounded-full border transition-colors",
                  selectedSubcategory?._id === sub._id
                    ? "bg-primary/80 text-primary-foreground border-primary/80"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30",
                )}
              >
                {sub.name}
              </button>
            ))
          ) : (
            <span className="text-xs text-muted-foreground py-1">
              Aucune sous-catégorie
            </span>
          )}
        </div>
      )}

      {/* Bottom row — more filters toggle + clear */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <FiChevronDown
            size={13}
            className={cn("transition-transform", showFilters && "rotate-180")}
          />
          {showFilters ? "Moins de filtres" : "Plus de filtres"}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <FiX size={12} />
            Effacer
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row gap-3">
          {/* Quartier on mobile */}
          <div className="flex flex-col gap-1 sm:hidden">
            <label className="text-xs text-muted-foreground">Quartier</label>
            <select
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
              className="h-10 px-3 text-sm border rounded-lg bg-background"
            >
              {QUARTIERS.map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-muted-foreground">Prix (MAD)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="self-center text-muted-foreground text-sm shrink-0">
                —
              </span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
