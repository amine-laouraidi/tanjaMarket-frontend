"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX, FiSliders } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function SearchFilter({ categories = [], subcategories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const priceRef = useRef(null);

  // Sync category/subcategory from URL on mount
  useEffect(() => {
    const catId = searchParams.get("category");
    const subId = searchParams.get("subcategory");
    if (catId) setSelectedCategory(categories.find((c) => c._id === catId) || null);
    if (subId) setSelectedSubcategory(subcategories.find((s) => s._id === subId) || null);
  }, []);

  // Close price dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (priceRef.current && !priceRef.current.contains(e.target))
        setShowPriceFilter(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category?._id === selectedCategory?._id || sub.category === selectedCategory?._id
  );

  const hasActiveFilters = query || selectedCategory || minPrice || maxPrice;

  const priceLabel =
    minPrice && maxPrice ? `${minPrice} – ${maxPrice} MAD`
    : minPrice ? `Min ${minPrice} MAD`
    : maxPrice ? `Max ${maxPrice} MAD`
    : "Prix";

  function push(overrides = {}) {
    const params = new URLSearchParams();
    const q = overrides.query ?? query;
    const cat = overrides.category !== undefined ? overrides.category : selectedCategory;
    const sub = overrides.subcategory !== undefined ? overrides.subcategory : selectedSubcategory;
    const min = overrides.minPrice ?? minPrice;
    const max = overrides.maxPrice ?? maxPrice;
    if (q?.trim()) params.set("q", q.trim());
    if (cat) params.set("category", cat._id);
    if (sub) params.set("subcategory", sub._id);
    if (min) params.set("minPrice", min);
    if (max) params.set("maxPrice", max);
    router.push(`/?${params.toString()}`);
  }

  function handleClear() {
    setQuery("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setMinPrice("");
    setMaxPrice("");
    router.push("/");
  }

  function selectCategory(cat) {
    const next = selectedCategory?._id === cat._id ? null : cat;
    setSelectedCategory(next);
    setSelectedSubcategory(null);
    push({ category: next, subcategory: null });
  }

  function selectSubcategory(sub) {
    const next = selectedSubcategory?._id === sub._id ? null : sub;
    setSelectedSubcategory(next);
    push({ subcategory: next });
  }

  function applyPrice() {
    setShowPriceFilter(false);
    push();
  }

  function clearPrice() {
    setMinPrice("");
    setMaxPrice("");
    setShowPriceFilter(false);
    push({ minPrice: "", maxPrice: "" });
  }

  return (
    <div className="mb-6 flex flex-col gap-3">

      {/* ── Search bar ── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && push()}
            className="w-full h-10 pl-9 pr-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); push({ query: "" }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiX size={13} />
            </button>
          )}
        </div>

        {/* Price filter button */}
        <div className="relative" ref={priceRef}>
          <button
            onClick={() => setShowPriceFilter((v) => !v)}
            className={cn(
              "h-10 px-3 text-sm border rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap",
              (minPrice || maxPrice)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:border-foreground/30"
            )}
          >
            <FiSliders size={13} />
            <span className="hidden sm:inline">{priceLabel}</span>
          </button>

          {/* Price dropdown */}
          {showPriceFilter && (
            <div className="absolute right-0 top-12 z-50 bg-background border rounded-xl shadow-lg p-4 w-[calc(100vw-2rem)] sm:w-64 max-w-xs">
              <p className="text-xs font-medium text-muted-foreground mb-3">Fourchette de prix (MAD)</p>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-9 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="self-center text-muted-foreground text-sm shrink-0">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-9 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyPrice}
                  className="flex-1 h-8 text-xs bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Appliquer
                </button>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={clearPrice}
                    className="h-8 px-3 text-xs border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="h-10 px-3 text-sm border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <FiX size={13} />
            <span className="hidden sm:inline">Effacer</span>
          </button>
        )}
      </div>

      {/* ── Category chips ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => selectCategory(null) || push({ category: null, subcategory: null })}
          className={cn(
            "h-7 px-3 text-xs rounded-full border transition-colors shrink-0",
            !selectedCategory
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:border-foreground/30"
          )}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => selectCategory(cat)}
            className={cn(
              "h-7 px-3 text-xs rounded-full border transition-colors shrink-0 flex items-center gap-1",
              selectedCategory?._id === cat._id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Subcategory chips — only when category selected ── */}
      {selectedCategory && filteredSubcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pl-2 border-l-2 border-primary/30">
          {filteredSubcategories.map((sub) => (
            <button
              key={sub._id}
              onClick={() => selectSubcategory(sub)}
              className={cn(
                "h-6 px-2.5 text-xs rounded-full border transition-colors shrink-0",
                selectedSubcategory?._id === sub._id
                  ? "bg-primary/80 text-primary-foreground border-primary/80"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30"
              )}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}