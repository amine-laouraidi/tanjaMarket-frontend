import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { RiMapPin2Line, RiTimeLine, RiEyeLine, RiArrowLeftLine } from "react-icons/ri";
import ImageGallery from "@/components/ImageGallery";

export default async function AdPage({ params }) {
    const {id} = await params;
  const res = await fetch(`${process.env.BACKEND_URL}/ads/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const ad = await res.json();
  console.log(res);

  const timeAgo = formatDistanceToNow(new Date(ad.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  const fields = ad.fields ? Object.entries(ad.fields) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <RiArrowLeftLine size={15} />
        Retour aux annonces
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Images + Details ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Image gallery */}
          <ImageGallery images={ad.images} title={ad.title} />

          {/* Title + meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {ad.category?.name}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {ad.subcategory?.name}
              </span>
            </div>
            <h1 className="text-xl font-semibold">{ad.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-[12px] text-muted-foreground">
              {ad.location?.city && (
                <span className="flex items-center gap-1">
                  <RiMapPin2Line size={13} /> {ad.location.city}
                  {ad.location.address && `, ${ad.location.address}`}
                </span>
              )}
              <span className="flex items-center gap-1">
                <RiTimeLine size={13} /> {timeAgo}
              </span>
              <span className="flex items-center gap-1">
                <RiEyeLine size={13} /> {ad.views} vues
              </span>
            </div>
          </div>

          {/* Description */}
          {ad.description && (
            <div>
              <h2 className="text-sm font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {ad.description}
              </p>
            </div>
          )}

          {/* Dynamic fields */}
          {fields.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3">Caractéristiques</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fields.map(([key, value]) => (
                  <div key={key} className="bg-secondary rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground capitalize mb-0.5">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm font-medium">
                      {typeof value === "boolean"
                        ? value ? "Oui" : "Non"
                        : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Price + Contact ── */}
        <div className="flex flex-col gap-4">

          {/* Price card */}
          <div className="border rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">
              {ad.price.toLocaleString("fr-MA")} MAD
            </p>
            {ad.phone && (
              <a
                href={`tel:${ad.phone}`}
                className="mt-4 w-full h-11 bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium rounded-lg flex items-center justify-center transition-opacity"
              >
                Appeler le vendeur
              </a>
            )}
            <a
              href={`https://wa.me/${ad.phone?.replace(/^0/, "212")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full h-11 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors"
            >
              WhatsApp
            </a>
          </div>

          {/* Publisher */}
          <div className="border rounded-xl p-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Vendeur
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                {ad.user?.fullName?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-medium">{ad.user?.fullName}</p>
                {ad.user?.phone && (
                  <p className="text-[12px] text-muted-foreground">{ad.user.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Safety tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-[11px] text-amber-700 leading-relaxed">
              <span className="font-semibold">Conseil de sécurité :</span> Ne payez jamais avant de voir l'article. Rencontrez le vendeur dans un lieu public.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}