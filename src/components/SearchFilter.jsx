"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX, FiSliders, FiChevronDown } from "react-icons/fi";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function SearchFilter({ categories = [], subcategories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef(null);
  const priceRef = useRef(null);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const currentCategory = searchParams.get("category") ?? "";
  const currentSubcategory = searchParams.get("subcategory") ?? "";
  const currentQuery = searchParams.get("q") ?? "";

  const hasActiveFilters = currentQuery || currentCategory || searchParams.get("minPrice") || searchParams.get("maxPrice");

  const priceLabel =
    searchParams.get("minPrice") && searchParams.get("maxPrice") ? `${searchParams.get("minPrice")}–${searchParams.get("maxPrice")} MAD`
    : searchParams.get("minPrice") ? `Min ${searchParams.get("minPrice")} MAD`
    : searchParams.get("maxPrice") ? `Max ${searchParams.get("maxPrice")} MAD`
    : "Prix";

  useEffect(() => {
    const handler = (e) => {
      if (priceRef.current && !priceRef.current.contains(e.target))
        setShowPriceFilter(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const update = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "category") params.delete("subcategory");
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const filteredSubs = subcategories.filter(
    (s) => s.category?._id === currentCategory || s.category === currentCategory
  );

  return (
    <div className="mb-6 flex flex-col gap-3">

      {/* ── Row 1: Search bar ── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            defaultValue={currentQuery}
            onChange={(e) => {
              clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => update("q", e.target.value.trim()), 500);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                clearTimeout(debounceRef.current);
                update("q", e.target.value.trim());
              }
            }}
            className="w-full h-10 pl-9 pr-8 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              router.push("/");
            }}
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
            onClick={() => update("category", "")}
            className={cn(
              "h-7 px-3 text-xs rounded-full border transition-colors shrink-0",
              !currentCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => update("category", currentCategory === cat._id ? "" : cat._id)}
              className={cn(
                "h-7 px-3 text-xs rounded-full border transition-colors shrink-0 flex items-center gap-1",
                currentCategory === cat._id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30"
              )}
            >
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
              searchParams.get("minPrice") || searchParams.get("maxPrice")
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:border-foreground/30"
            )}
          >
            <FiSliders size={11} />
            <span>{priceLabel}</span>
            <FiChevronDown size={11} className={cn("transition-transform", showPriceFilter && "rotate-180")} />
          </button>

          {showPriceFilter && (
            <div className="absolute right-0 top-9 z-50 bg-background border rounded-xl shadow-lg p-4 w-[calc(100vw-3rem)] sm:w-60">
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
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    if (minPrice) params.set("minPrice", minPrice);
                    else params.delete("minPrice");
                    if (maxPrice) params.set("maxPrice", maxPrice);
                    else params.delete("maxPrice");
                    params.delete("page");
                    router.push(`/?${params.toString()}`);
                    setShowPriceFilter(false);
                  }}
                  className="flex-1 h-8 text-xs bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      const params = new URLSearchParams(searchParams);
                      params.delete("minPrice");
                      params.delete("maxPrice");
                      router.push(`/?${params.toString()}`);
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
      {currentCategory && filteredSubs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pl-2 border-l-2 border-primary/30">
          {filteredSubs.map((sub) => (
            <button
              key={sub._id}
              onClick={() => update("subcategory", currentSubcategory === sub._id ? "" : sub._id)}
              className={cn(
                "h-6 px-2.5 text-xs rounded-full border transition-colors shrink-0",
                currentSubcategory === sub._id
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