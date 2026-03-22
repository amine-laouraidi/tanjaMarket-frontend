"use client";

import { useState } from "react";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import saveAd from "@/app/actions/saveAd";
import { useSavedCount, useUser } from "@/context/GlobalContext";
import { tr } from "date-fns/locale";

export default function SaveAdButton({ adId ,initialSaved}) {
  const [isSaved,setIsSaved] = useState(initialSaved);
  const [animating, setAnimating] = useState(false);
  const user = useUser();
  const [savedCount, setSavedCount] = useSavedCount();
  const toggle = async () => {
    if (!user) {
      toast("Vous devez être connecté pour sauvegarder cette annonce.");
      return;
    }
    try {
      const save = await saveAd(adId);
      if (save) {
        toast.success("Annonce sauvegardée !");

        setIsSaved(true);
        setSavedCount((prev) => prev + 1);
        setAnimating(true);
      } else {
        toast.success("Annonce retirée des favoris");
        setIsSaved(false);
        setSavedCount((prev) => prev - 1);
      }
    } catch (e) {
      toast.error(e);
    }
  };
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            className={`h-9 w-9 shrink-0 transition-all duration-200 ${
              isSaved
                ? "border-amber-300 bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600"
                : "text-muted-foreground hover:text-foreground"
            } ${animating ? "scale-125" : "scale-100"}`}
            aria-label={isSaved ? "Retirer des favoris" : "Sauvegarder l'annonce"}
          >
            {isSaved ? <RiBookmarkFill size={16} /> : <RiBookmarkLine size={16} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">
            {isSaved ? "Retirer des favoris" : "Sauvegarder"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
