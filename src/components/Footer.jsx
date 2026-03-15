import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

        <div className="col-span-2 md:col-span-1">
          <p className="text-lg font-medium text-primary mb-2">TanjaMarket</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            La première plateforme d'annonces classées à Tanger.
            Achetez, vendez et échangez en toute simplicité.
          </p>
          <div className="flex gap-2">
            {[
              { icon: <FaFacebook size={14} />, href: "https://facebook.com", label: "Facebook" },
              { icon: <FaInstagram size={14} />, href: "https://instagram.com", label: "Instagram" },
              { icon: <FaWhatsapp size={14} />, href: "https://wa.me/212600000000", label: "WhatsApp" },
              { icon: <FaTiktok size={14} />, href: "https://tiktok.com", label: "TikTok" },
            ].map((s) => (
              <Link key={s.label} href={s.href} target="_blank" aria-label={s.label}
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
                {s.icon}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-3">Annonces</p>
          {[
            { label: "Toutes les annonces", href: "/" },
            { label: "Voitures", href: "/?category=voitures" },
            { label: "Immobilier", href: "/?category=immobilier" },
            { label: "Téléphones", href: "/?category=telephones" },
            { label: "Emploi", href: "/?category=emploi" },
            { label: "Déposer une annonce", href: "/post" },
          ].map((l) => (
            <Link key={l.label} href={l.href}
              className="block text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-3">Tanger</p>
          {[
            { label: "Tanger Centre", href: "/?ville=centre" },
            { label: "Malabata", href: "/?ville=malabata" },
            { label: "Mesnana", href: "/?ville=mesnana" },
            { label: "Beni Makada", href: "/?ville=beni-makada" },
            { label: "Gzenaya", href: "/?ville=gzenaya" },
            { label: "Tétouan", href: "/?ville=tetouan" },
          ].map((l) => (
            <Link key={l.label} href={l.href}
              className="block text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-3">À propos</p>
          {[
            { label: "À propos de nous", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Aide & FAQ", href: "/faq" },
            { label: "Signaler une annonce", href: "/report" },
          ].map((l) => (
            <Link key={l.label} href={l.href}
              className="block text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

      </div>

      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © 2025 TanjaMarket. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {[
              { label: "Conditions d'utilisation", href: "/terms" },
              { label: "Confidentialité", href: "/privacy" },
              { label: "Cookies", href: "/cookies" },
            ].map((l) => (
              <Link key={l.label} href={l.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}