import { authFetch } from "@/lib/authFetch";
import ImageGallery from "@/components/ImageGallery";
import AdStatusChanger from "@/components/admin/AdStatusChanger";
import { RiMapPinLine, RiEyeLine, RiTimeLine, RiUserLine, RiPhoneLine, RiPriceTagLine } from "react-icons/ri";
import { notFound } from "next/navigation";

async function getAd(id) {
  const res = await authFetch(`/ads/${id}`, { cache: "no-store" });
  if (!res || !res.ok) return null;
  return res.json();
}

const STATUS_STYLES = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  rejected:  "bg-red-50 text-red-600 border-red-200",
  sold:      "bg-gray-100 text-gray-500 border-gray-200",
  expired:   "bg-orange-50 text-orange-600 border-orange-200",
};

export default async function AdDetailPage({ params }) {
  const { id } = await params;
  const ad = await getAd(id);
  if (!ad) notFound();

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">{ad.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${STATUS_STYLES[ad.status]}`}>
              {ad.status}
            </span>
            <span className="text-[12px] text-gray-400 flex items-center gap-1">
              <RiEyeLine size={12} /> {ad.views} views
            </span>
            <span className="text-[12px] text-gray-400 flex items-center gap-1">
              <RiTimeLine size={12} />
              {new Date(ad.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
        {/* Status changer */}
        <AdStatusChanger adId={ad._id} currentStatus={ad.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — images + details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Gallery */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <ImageGallery images={ad.images} title={ad.title} />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
            <p className="text-[13px] font-semibold text-gray-700">Description</p>
            <p className="text-[13px] text-gray-500 whitespace-pre-line leading-relaxed">
              {ad.description || "—"}
            </p>
          </div>

          {/* Custom fields */}
          {ad.fields && Object.keys(ad.fields).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <p className="text-[13px] font-semibold text-gray-700">Details</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ad.fields).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-gray-400 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-[13px] text-gray-700 font-medium">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — meta */}
        <div className="space-y-4">
          {/* Price */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-[12px] text-gray-400 mb-1">Price</p>
            <p className="text-[22px] font-bold text-gray-900">
              {ad.price?.toLocaleString("fr-MA")}
              <span className="text-[13px] font-normal text-gray-400 ml-1">MAD</span>
            </p>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
            <p className="text-[12px] text-gray-400 font-medium flex items-center gap-1.5">
              <RiPriceTagLine size={12} /> Category
            </p>
            <p className="text-[13px] text-gray-700 font-medium">
              {ad.category?.icon} {ad.category?.name}
            </p>
            <p className="text-[12px] text-gray-400">{ad.subcategory?.name}</p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
            <p className="text-[12px] text-gray-400 font-medium flex items-center gap-1.5">
              <RiMapPinLine size={12} /> Location
            </p>
            <p className="text-[13px] text-gray-700 font-medium">{ad.location?.city}</p>
            <p className="text-[12px] text-gray-400">{ad.location?.address}</p>
          </div>

          {/* Seller */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <p className="text-[12px] text-gray-400 font-medium flex items-center gap-1.5">
              <RiUserLine size={12} /> Seller
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0">
                {ad.user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-medium text-gray-800">{ad.user?.fullName}</p>
                <p className="text-[12px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <RiPhoneLine size={11} /> {ad.user?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}