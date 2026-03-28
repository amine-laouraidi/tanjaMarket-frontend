"use client";

import { useActionState, useEffect, useState } from "react";
import { changeAdStatusAction } from "@/app/actions/adminAd";
import { toast } from "sonner";
import { RiSaveLine } from "react-icons/ri";

const STATUSES = ["published", "pending", "rejected", "sold", "expired"];

export default function AdStatusChanger({ adId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [state, formAction, isPending] = useActionState(changeAdStatusAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      setStatus(state.status);
    } else {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={adId} />
      <select
        name="status"
        defaultValue={status}
        className="px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        <RiSaveLine size={14} />
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}