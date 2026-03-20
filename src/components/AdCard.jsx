import Link from "next/link";

export default function AdCard({ ad }) {
  return (
    <Link href={`/listings/${ad.id}`} className="group block border rounded-xl overflow-hidden hover:border-border/80 transition-colors bg-background">
      <div className="aspect-[4/3] bg-secondary flex items-center justify-center overflow-hidden">
        {ad.image ? (
          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-border" />
        )}
      </div>
      <div className="p-3">
        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mb-2">
          {ad.category.name}
        </span>
        <p className="text-sm font-medium truncate">{ad.title}</p>
        <p className="text-base font-medium text-primary mt-1">{ad.price} MAD</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[11px] text-muted-foreground">{ad.location.city}</span>
          <span className="text-[11px] text-muted-foreground">{ad.time}</span>
        </div>
      </div>
    </Link>
  );
}