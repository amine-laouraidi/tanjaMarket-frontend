"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAd } from "@/app/actions/Deletead";
import { toast } from "sonner";
import { RiDeleteBinLine, RiLoader4Line } from "react-icons/ri";
import { useEffect, useState } from "react";

export default function DeleteAdButton({ adId }) {
  const [confirming, setConfirming] = useState(false);

  async function action(prevState) {
    try {
      await deleteAd(adId);
      toast.success("Annonce supprimée");
      return { success: true };
    } catch {
      toast.error("Erreur lors de la suppression");
      setConfirming(false);
      return { success: false };
    }
  }

  const [state, formAction, isPending] = useActionState(action, null);

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground">Confirmer ?</span>
        <form action={formAction}>
          <Button
            type="submit"
            size="sm"
            variant="destructive"
            className="h-7 text-xs px-3"
            disabled={isPending}
          >
            {isPending ? <RiLoader4Line size={12} className="animate-spin" /> : "Oui"}
          </Button>
        </form>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs px-3"
          onClick={() => setConfirming(false)}
          disabled={isPending}
        >
          Non
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-7 text-xs px-3 text-destructive hover:text-destructive hover:border-destructive/40"
      onClick={() => setConfirming(true)}
    >
      <RiDeleteBinLine size={12} className="mr-1" />
      Supprimer
    </Button>
  );
}