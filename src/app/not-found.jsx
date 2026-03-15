import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiSearch, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-4">
      <p className="text-7xl font-medium text-border">404</p>
      <h1 className="text-xl font-medium">Page introuvable</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Cette page n'existe pas ou a été supprimée. Revenez à l'accueil pour continuer.
      </p>
      <div className="flex gap-3 mt-2">
        <Button asChild>
          <Link href="/">
            <FiHome size={15} className="mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/?q=">
            <FiSearch size={15} className="mr-2" />
            Parcourir les annonces
          </Link>
        </Button>
      </div>
    </main>
  );
}