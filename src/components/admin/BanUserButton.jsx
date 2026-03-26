"use client";

import { useActionState, useEffect } from "react";
import { banUserAction } from "@/app/actions/adminUsers";
import { toast } from "sonner";
import { RiUserForbidLine, RiUserLine, RiShieldLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

export default function BanUserButton({ userId, currentStatus }) {
  const [state, action, isPending] = useActionState(banUserAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.error);
  }, [state]);

  const nextStatus = currentStatus === "active" ? "banned" : "active";
  const label = currentStatus === "active" ? "Ban" : currentStatus === "banned" ? "Unban" : "Restore";
  const Icon = currentStatus === "active" ? RiUserForbidLine : RiUserLine;

  return (
    <form action={action}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="status" value={nextStatus} />
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium border transition-colors disabled:opacity-50",
          currentStatus === "active"
            ? "text-amber-600 hover:bg-amber-50 border-amber-200"
            : "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
        )}
      >
        <Icon size={13} />
        {isPending ? "..." : label}
      </button>
    </form>
  );
}