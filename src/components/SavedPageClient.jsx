"use client";

import { useState } from "react";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import { RiBookmarkLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

export default function SavedPageClient({ initialAds }) {
  const [ads, setAds] = useState(initialAds);

  const removeAd = (adId) => {
    setAds((prev) => prev.filter((ad) => ad._id !== adId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Mes favoris</h1>
        {ads.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {ads.length} annonce{ads.length > 1 ? "s" : ""} sauvegardée{ads.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <RiBookmarkLine size={24} className="text-muted-foreground" />
          </div>
          <h2 className="text-base font-medium mb-1">Aucun favori pour l'instant</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Sauvegardez des annonces qui vous intéressent pour les retrouver facilement ici.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/listings">Parcourir les annonces</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ads.map((ad) => (
            <AdCard
              key={ad._id}
              ad={ad}
              initialSaved={true}
              showUnsave={true}
              onUnsave={() => removeAd(ad._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}