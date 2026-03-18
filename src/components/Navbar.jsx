"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FiBookmark,
  FiMenu,
  FiX,
  FiUser,
  FiLogIn,
  FiList,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";

const BOOKMARK_COUNT = 3;

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <nav className="flex items-center justify-between px-6 h-[60px] max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-lg font-medium text-primary">
          TanjaMarket
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-px h-6 bg-border mx-1" />

          {/* Bookmarks */}
          <Button variant="outline" size="icon" className="relative" asChild>
            <Link href="/favorites">
              <FiBookmark size={16} />
              {BOOKMARK_COUNT > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-900 text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {BOOKMARK_COUNT}
                </span>
              )}
            </Link>
          </Button>

          {/* Post Ad — always visible */}
          <Button asChild>
            <Link href="/post">+ Déposer</Link>
          </Button>

          {/* Auth */}
          {!isLoggedIn ? (
            <Button variant="outline" asChild>
              <Link href="/auth/login">
                <FiLogIn size={15} className="mr-2" />
                Connexion
              </Link>
            </Button>
          ) : (
            <UserMenu />
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Button asChild size="sm">
            <Link href="/post">+ Déposer</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t flex flex-col p-4 gap-1 bg-background">
          <MobileItem
            href="/favorites"
            icon={<FiHeart size={15} />}
            label="Favoris"
            badge={BOOKMARK_COUNT}
          />
          <div className="h-px bg-border my-1" />
          {!isLoggedIn ? (
            <MobileItem
              href="/auth/login"
              icon={<FiLogIn size={15} />}
              label="Connexion"
            />
          ) : (
            <>
              <MobileItem
                href="/profile"
                icon={<FiUser size={15} />}
                label="Mon profil"
              />
              <MobileItem
                href="/profile/listings"
                icon={<FiList size={15} />}
                label="Mes annonces"
              />
              <MobileItem
                href="/logout"
                icon={<FiLogOut size={15} />}
                label="Déconnexion"
              />
            </>
          )}
        </div>
      )}
    </header>
  );
}

function MobileItem({ href, icon, label, badge }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
        hover:bg-secondary transition-colors"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
      {badge > 0 && (
        <span
          className="ml-auto bg-amber-400 text-amber-900 text-[10px]
          font-medium rounded-full px-2 py-0.5"
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function UserMenu() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/profile">
          <div
            className="w-7 h-7 rounded-full bg-primary text-primary-foreground
            text-xs font-medium flex items-center justify-center"
          >
            AB
          </div>
        </Link>
      </Button>
    </div>
  );
}
