"use client";

import { useState } from "react";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import saveAd from "@/app/actions/saveAd";
import { useSavedCount, useUser } from "@/context/GlobalContext";

export default function SaveAdButton({ adId, initialSaved, showUnsave = false }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [animating, setAnimating] = useState(false);
  const [removed, setRemoved] = useState(false);
  const user = useUser();
  const [savedCount, setSavedCount] = useSavedCount();

  const toggle = async () => {
    if (!user) {
      toast("Vous devez être connecté pour sauvegarder cette annonce.");
      return;
    }
    try {
      const saved = await saveAd(adId);
      if (saved) {
        toast.success("Annonce sauvegardée !");
        setIsSaved(true);
        setSavedCount((prev) => prev + 1);
        setAnimating(true);
        setTimeout(() => setAnimating(false), 300);
      } else {
        toast.success("Annonce retirée des favoris");
        setIsSaved(false);
        setSavedCount((prev) => prev - 1);
        // If we're on the saved page, fade out the card
        if (showUnsave) setRemoved(true);
      }
    } catch (e) {
      toast.error("Une erreur s'est produite");
    }
  };

  if (removed) return null;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={toggle}
          className={`h-8 w-8 shrink-0 transition-all duration-200 bg-background/80 backdrop-blur-sm ${
            isSaved
              ? "border-amber-300 bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600"
              : "text-muted-foreground hover:text-foreground"
          } ${animating ? "scale-125" : "scale-100"}`}
          aria-label={isSaved ? "Retirer des favoris" : "Sauvegarder l'annonce"}
        >
          {isSaved ? <RiBookmarkFill size={14} /> : <RiBookmarkLine size={14} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">
          {isSaved ? "Retirer des favoris" : "Sauvegarder"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}