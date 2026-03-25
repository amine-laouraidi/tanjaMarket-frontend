import { authFetch } from "@/lib/authFetch";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { RiAddLine, RiFileListLine } from "react-icons/ri";
import DeleteAdButton from "@/components/profile/DeleteAdButton";

export const metadata = {
  title: "Mes annonces | TanjaMarket",
};

const statusConfig = {
  published: { label: "Publiée",    className: "bg-emerald-100 text-emerald-700" },
  pending:   { label: "En attente", className: "bg-amber-100 text-amber-700" },
  rejected:  { label: "Refusée",    className: "bg-red-100 text-red-700" },
  sold:      { label: "Vendue",     className: "bg-gray-100 text-gray-600" },
};

export default async function MyAdsPage() {
  const res = await authFetch("/ads/user");
  const json = await res.json();
  const ads = json.data ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes annonces</h1>
          {ads.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {ads.length} annonce{ads.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button asChild size="sm">
          <Link href="/post">
            <RiAddLine size={15} className="mr-1.5" />
            <span className="hidden sm:inline">Nouvelle annonce</span>
            <span className="sm:hidden">Déposer</span>
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <RiFileListLine size={24} className="text-muted-foreground" />
          </div>
          <h2 className="text-base font-medium mb-1">Aucune annonce pour l'instant</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Déposez votre première annonce et touchez des milliers d'acheteurs à Tanger.
          </p>
          <Button asChild size="sm">
            <Link href="/post">
              <RiAddLine size={15} className="mr-1.5" />
              Déposer une annonce
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ads.map((ad) => {
            const status = statusConfig[ad.status] ?? statusConfig.pending;
            const firstImage = ad.images?.[0]?.url;
            const timeAgo = formatDistanceToNow(new Date(ad.createdAt), {
              addSuffix: true,
              locale: fr,
            });

            return (
              <div
                key={ad._id}
                className="bg-background border rounded-xl overflow-hidden hover:border-foreground/20 transition-all"
              >
                {/* Top: image + info */}
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <Link href={`/listings/${ad._id}`} className="shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary relative">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={ad.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-7 h-7 rounded bg-border" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/listings/${ad._id}`}
                        className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors leading-snug"
                      >
                        {ad.title}
                      </Link>
                      <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {ad.price.toLocaleString("fr-MA")} MAD
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {ad.category?.name} · {ad.location?.city || "Tanger"} · {timeAgo}
                    </p>
                  </div>
                </div>

                {/* Bottom: views + actions — always full width */}
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-t bg-muted/30">
                  <span className="text-[11px] text-muted-foreground">
                    {ad.views} vue{ad.views !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs px-3">
                      <Link href={`/listings/${ad._id}/edit`}>Modifier</Link>
                    </Button>
                    <DeleteAdButton adId={ad._id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}