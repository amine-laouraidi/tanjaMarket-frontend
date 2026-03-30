"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Pagination({ pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (pagination.pages <= 1) return null;

  function goToPage(page) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page === 1}
        onClick={() => goToPage(pagination.page - 1)}
      >
        Précédent
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={cn(
              "w-8 h-8 text-xs rounded-lg border transition-colors",
              p === pagination.page
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:border-foreground/30"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page === pagination.pages}
        onClick={() => goToPage(pagination.page + 1)}
      >
        Suivant
      </Button>
    </div>
  );
}