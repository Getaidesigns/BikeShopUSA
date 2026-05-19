// src/components/layout/Footer.tsx
import Link from "next/link";
import { Bike } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-black text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <Bike className="h-5 w-5 text-white" />
              </div>
              BikeShops<span className="text-brand-400">USA</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              The most complete directory of bike shops across the United States. Find your local shop, compare services, and discover great deals.
            </p>
          </div>

          {/* Directory */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Directory
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/search", label: "All Bike Shops" },
                { href: "/search?featured=true", label: "Featured Shops" },
                { href: "/search?bikeTypes=mountain", label: "Mountain Bike Shops" },
                { href: "/search?bikeTypes=road", label: "Road Bike Shops" },
                { href: "/search?bikeTypes=e-bike", label: "E-Bike Dealers" },
                { href: "/search?services=repair", label: "Repair Shops" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Shops */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              For Shops
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/submit", label: "List Your Shop" },
                { href: "/claim", label: "Claim a Listing" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} BikeShopsUSA.org · All rights reserved
          </p>
          <p className="text-xs text-slate-600">
            Built with Next.js, Prisma & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
