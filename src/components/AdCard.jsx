import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import SaveAdButton from "./SaveAdButton";

export default function AdCard({ ad, initialSaved = false, showUnsave = false }) {
  const firstImage = ad.images?.[0];

  const timeAgo = formatDistanceToNow(new Date(ad.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <div className="group relative border rounded-xl overflow-hidden hover:border-foreground/20 hover:shadow-sm transition-all bg-background">
      {/* Save button — top right corner */}
      <div className="absolute top-2 right-2 z-10">
        <SaveAdButton adId={ad._id} initialSaved={initialSaved} showUnsave={showUnsave} />
      </div>

      <Link href={`/listings/${ad._id}`} className="block">
        {/* Image */}
        <div className="aspect-[4/3] bg-secondary overflow-hidden relative">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 rounded-lg bg-border" />
            </div>
          )}
          {/* Images count badge */}
          {ad.images?.length > 1 && (
            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md">
              {ad.images.length} photos
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mb-2">
            {ad.category?.name}
          </span>
          <p className="text-sm font-medium truncate pr-1">{ad.title}</p>
          <p className="text-base font-semibold text-primary mt-1">
            {ad.price.toLocaleString("fr-MA")} MAD
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-muted-foreground">
              {ad.location?.city || "Tanger"}
            </span>
            <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}