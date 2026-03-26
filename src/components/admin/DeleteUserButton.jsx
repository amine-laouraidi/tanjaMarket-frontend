"use client";

import { useActionState, useEffect, useState } from "react";
import { deleteUserAction } from "@/app/actions/adminUsers";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";

export default function DeleteUserButton({ userId }) {
  const [state, action, isPending] = useActionState(deleteUserAction, null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.error);
    setConfirming(false);
  }, [state]);

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-gray-400">Sure?</span>
        <form action={action}>
          <input type="hidden" name="userId" value={userId} />
          <button
            type="submit"
            disabled={isPending}
            className="px-2 py-1 rounded text-[11px] font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? "..." : "Yes"}
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded text-[11px] font-medium text-gray-500 hover:bg-gray-100 transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
    >
      <RiDeleteBinLine size={13} />
      Delete
    </button>
  );
}