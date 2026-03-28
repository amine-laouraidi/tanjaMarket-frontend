"use client";

import { useActionState, useEffect } from "react";
import { deleteAdAction } from "@/app/actions/adminAd";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";

export default function AdDeleteButton({ adId }) {
  const [state, formAction, isPending] = useActionState(deleteAdAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={adId} />
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-red-500 hover:bg-red-50 border border-red-200 disabled:opacity-50 transition-colors"
      >
        <RiDeleteBinLine size={13} />
        {isPending ? "..." : "Delete"}
      </button>
    </form>
  );
}