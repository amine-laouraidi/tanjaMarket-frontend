"use client";

import { useActionState, useEffect, useState } from "react";
import { bulkDeleteAdsAction } from "@/app/actions/adminAd";
import { toast } from "sonner";
import { RiEyeLine, RiImageLine, RiDeleteBin2Line } from "react-icons/ri";
import { cn } from "@/lib/utils";
import AdDeleteButton from "@/components/admin/AdDeleteButton";
import Link from "next/link";

const STATUS_STYLES = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  rejected:  "bg-red-50 text-red-600 border-red-200",
  sold:      "bg-gray-100 text-gray-500 border-gray-200",
  expired:   "bg-orange-50 text-orange-600 border-orange-200",
};

export default function AdsTable({ ads, pagination }) {
  const [selected, setSelected] = useState([]);
  const [confirming, setConfirming] = useState(false);

  const [state, formAction, isPending] = useActionState(bulkDeleteAdsAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      setSelected([]);
      setConfirming(false);
    } else {
      toast.error(state.error);
    }
  }, [state]);

  const toggleAll = (e) =>
    setSelected(e.target.checked ? ads.map((a) => a._id) : []);

  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const allChecked = ads.length > 0 && selected.length === ads.length;

  if (!ads.length) {
    return <p className="text-[13px] text-gray-400 py-8 text-center">No ads found.</p>;
  }

  return (
    <div className="space-y-3">
      {/* Bulk action bar */}
      {selected.length > 0 && (
        <form action={formAction}>
          <input type="hidden" name="ids" value={selected.join(",")} />
          <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[13px]">
            <span className="text-emerald-700 font-medium">{selected.length} selected</span>

            {!confirming ? (
              <>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[12px] font-medium hover:bg-red-600 transition-colors"
                >
                  <RiDeleteBin2Line size={13} />
                  Delete selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 text-[12px] font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="ml-auto text-[12px] text-red-600 font-medium">
                  Delete {selected.length} ads permanently?
                </span>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-[12px] font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 text-[12px] font-medium hover:bg-gray-50 transition-colors"
                >
                  No, cancel
                </button>
              </>
            )}
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-emerald-600"
                  />
                </th>
                {["Ad", "User", "Category", "Price", "Status", "Date", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400",
                      h === "Actions" ? "text-right" : "text-left"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ads.map((ad) => (
                <tr
                  key={ad._id}
                  className={cn(
                    "hover:bg-gray-50/50 transition-colors",
                    selected.includes(ad._id) && "bg-emerald-50/40"
                  )}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(ad._id)}
                      onChange={() => toggleOne(ad._id)}
                      className="w-4 h-4 rounded accent-emerald-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {ad.images?.[0]?.url ? (
                          <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover" />
                        ) : (
                          <RiImageLine size={15} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 leading-tight line-clamp-1 max-w-[180px]">{ad.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{ad.subcategory?.name ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700 font-medium">{ad.user?.fullName ?? "—"}</p>
                    <p className="text-[11px] text-gray-400">{ad.user?.phone ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{ad.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {ad.price?.toLocaleString("fr-MA")}
                    <span className="text-[11px] font-normal text-gray-400 ml-1">MAD</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize", STATUS_STYLES[ad.status])}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-[12px]">
                    {new Date(ad.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/ads/${ad._id}`}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                      >
                        <RiEyeLine size={13} />
                        View
                      </Link>
                      <AdDeleteButton adId={ad._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-[12px] text-gray-400 bg-gray-50/40">
            <span>Page {pagination.page} of {pagination.pages}</span>
            <span>{pagination.total} total ads</span>
          </div>
        )}
      </div>
    </div>
  );
}