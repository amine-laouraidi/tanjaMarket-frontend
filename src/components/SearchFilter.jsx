"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX, FiSliders, FiChevronDown } from "react-icons/fi";
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
    (sub) =>
      sub.category?._id === selectedCategory?._id ||
      sub.category === selectedCategory?._id
  );

  const hasActiveFilters = query || selectedCategory || minPrice || maxPrice;

  const priceLabel =
    minPrice && maxPrice ? `${minPrice}–${maxPrice} MAD`
    : minPrice ? `Min ${minPrice} MAD`
    : maxPrice ? `Max ${maxPrice} MAD`
    : "Prix";

  // ── Only place that fires a request ──
  function handleSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCategory) params.set("category", selectedCategory._id);
    if (selectedSubcategory) params.set("subcategory", selectedSubcategory._id);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
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
  }

  return (
    <div className="mb-6 flex flex-col gap-3">

      {/* ── Row 1: Search bar + Search button ── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full h-10 pl-9 pr-8 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiX size={13} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="h-10 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
        >
          <FiSearch size={14} />
          <span className="hidden sm:inline">Rechercher</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="h-10 px-3 text-sm border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <FiX size={13} />
            <span className="hidden sm:inline">Effacer</span>
          </button>
        )}
      </div>

      {/* ── Row 2: Category chips + Price filter ── */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-1 min-w-0">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubcategory(null);
            }}
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

        {/* Price filter */}
        <div className="relative shrink-0" ref={priceRef}>
          <button
            onClick={() => setShowPriceFilter((v) => !v)}
            className={cn(
              "h-7 px-3 text-xs border rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap",
              minPrice || maxPrice
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:border-foreground/30"
            )}
          >
            <FiSliders size={11} />
            <span>{priceLabel}</span>
            <FiChevronDown
              size={11}
              className={cn("transition-transform", showPriceFilter && "rotate-180")}
            />
          </button>

          {showPriceFilter && (
            <div className="absolute right-0 top-9 z-50 bg-background border rounded-xl shadow-lg p-4 w-[calc(100vw-3rem)] sm:w-60">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Fourchette de prix (MAD)
              </p>
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
                  onClick={() => setShowPriceFilter(false)}
                  className="flex-1 h-8 text-xs bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      setShowPriceFilter(false);
                    }}
                    className="h-8 px-3 text-xs border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: Subcategory chips ── */}
      {selectedCategory && filteredSubcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pl-2 border-l-2 border-primary/30">
          {filteredSubcategories.map((sub) => (
            <button
              key={sub._id}
              onClick={() =>
                setSelectedSubcategory(
                  selectedSubcategory?._id === sub._id ? null : sub
                )
              }
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