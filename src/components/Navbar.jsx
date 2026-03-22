"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FiBookmark, FiMenu, FiX, FiUser,
  FiLogIn, FiList, FiHeart, FiLogOut,
} from "react-icons/fi";
import { useSavedCount, useUser } from "@/context/GlobalContext";
import logout from "@/app/actions/logout";


export default function Navbar() {
  const user = useUser();
  const [savedCount, setSavedCount] = useSavedCount();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <nav className="flex items-center justify-between px-6 h-[60px] max-w-7xl mx-auto">
        <Link href="/" className="text-lg font-medium text-primary">
          TanjaMarket
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="outline" size="icon" className="relative" asChild>
            <Link href="/favorites">
              <FiBookmark size={16} />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-900 text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/post">+ Déposer</Link>
          </Button>
          {!user ? (
            <Button variant="outline" asChild>
              <Link href="/auth/login">
                <FiLogIn size={15} className="mr-2" />
                Connexion
              </Link>
            </Button>
          ) : (
            <UserMenu user={user} />
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Button asChild size="sm">
            <Link href="/post">+ Déposer</Link>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t flex flex-col p-4 gap-1 bg-background">
          <MobileItem href="/favorites" icon={<FiHeart size={15} />} label="Favoris" badge={savedCount} />
          <div className="h-px bg-border my-1" />
          {!user ? (
            <MobileItem href="/auth/login" icon={<FiLogIn size={15} />} label="Connexion" />
          ) : (
            <>
              <MobileItem href="/profile" icon={<FiUser size={15} />} label="Mon profil" />
              <MobileItem href="/profile/listings" icon={<FiList size={15} />} label="Mes annonces" />
              <form action={logout}>
                <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors w-full text-left text-destructive">
                  <FiLogOut size={15} />
                  Déconnexion
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close only when clicking outside the dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-44 bg-background border rounded-lg shadow-md z-50 overflow-hidden">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
          >
            <FiUser size={14} className="text-muted-foreground" />
            Mon profil
          </Link>
          <div className="h-px bg-border" />
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors w-full text-left"
            >
              <FiLogOut size={14} />
              Déconnexion
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MobileItem({ href, icon, label, badge }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors">
      <span className="text-muted-foreground">{icon}</span>
      {label}
      {badge > 0 && (
        <span className="ml-auto bg-amber-400 text-amber-900 text-[10px] font-medium rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </Link>
  );
}