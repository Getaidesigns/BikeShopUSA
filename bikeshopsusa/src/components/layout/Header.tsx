"use client";
// src/components/layout/Header.tsx
import Link from "next/link";
import { useState } from "react";
import { Bike, Menu, X, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-black text-slate-900 hover:text-brand-600 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <Bike className="h-5 w-5 text-white" />
          </div>
          <span>
            BikeShops<span className="text-brand-500">USA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/search" className="text-sm font-medium text-slate-600 hover:text-brand-500 transition-colors">
            Find Shops
          </Link>
          <Link href="/search?featured=true" className="text-sm font-medium text-slate-600 hover:text-brand-500 transition-colors">
            Featured
          </Link>
          <Link
            href="/submit"
            className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-100"
          >
            <Plus className="h-4 w-4" />
            List Your Shop
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden animate-slide-up">
          <nav className="flex flex-col gap-1">
            {[
              { href: "/search", label: "Find Shops" },
              { href: "/search?featured=true", label: "Featured Shops" },
              { href: "/submit", label: "List Your Shop" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
