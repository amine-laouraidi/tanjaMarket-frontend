"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Tous", "Voitures", "Immobilier", "Téléphones", "Vêtements", "Emploi", "Maison", "Animaux"];
const QUARTIERS = ["Tanger", "Centre", "Malabata", "Mesnana", "Beni Makada", "Gzenaya"];

export default function SearchFilter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [quartier, setQuartier] = useState("Tanger");

  function handleSearch() {
   
  }

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
          className="flex-1 h-10 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select
          value={quartier}
          onChange={(e) => setQuartier(e.target.value)}
          className="h-10 px-3 text-sm border rounded-lg bg-background"
        >
          {QUARTIERS.map((q) => <option key={q}>{q}</option>)}
        </select>
        <Button onClick={handleSearch}>
          <FiSearch size={15} className="mr-2" />
          Rechercher
        </Button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "h-7 px-3 text-xs rounded-full border transition-colors",
              category === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}