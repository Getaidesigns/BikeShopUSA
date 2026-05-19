// src/app/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench, MapPin, Star, Shield, Bike } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/ui/SearchBar";
import { ShopCard } from "@/components/shop/ShopCard";
import { Tag } from "@/components/ui/Tag";

export const metadata: Metadata = {
  title: "BikeShopsUSA – Find the Best Bike Shops Near You",
  description:
    "Search thousands of bike shops across the United States. Find repair services, bike rentals, custom builds, and more.",
};

export const revalidate = 3600; // revalidate every hour

async function getFeaturedShops() {
  return prisma.shop.findMany({
    where: { isFeatured: true, isActive: true },
    take: 6,
    orderBy: [{ rating: "desc" }],
    include: {
      services: { include: { service: { select: { name: true, slug: true } } } },
      bikeTypes: { include: { bikeType: { select: { name: true, slug: true } } } },
      brands: { include: { brand: { select: { name: true, slug: true } } } },
    },
  });
}

async function getStats() {
  const [shopCount, cityCount] = await Promise.all([
    prisma.shop.count({ where: { isActive: true } }),
    prisma.shop.findMany({
      where: { isActive: true },
      select: { city: true },
      distinct: ["city"],
    }),
  ]);
  return { shopCount, cityCount: cityCount.length };
}

const QUICK_FILTERS = [
  { label: "Repair & Tune-up", slug: "repair", type: "services" },
  { label: "Bike Fitting", slug: "bike-fitting", type: "services" },
  { label: "Rentals", slug: "rentals", type: "services" },
  { label: "Mountain Bikes", slug: "mountain", type: "bikeTypes" },
  { label: "Road Bikes", slug: "road", type: "bikeTypes" },
  { label: "E-Bikes", slug: "e-bike", type: "bikeTypes" },
  { label: "Custom Builds", slug: "custom-builds", type: "services" },
  { label: "Gravel Bikes", slug: "gravel", type: "bikeTypes" },
];

const POPULAR_CITIES = [
  { city: "Austin", state: "TX" },
  { city: "Denver", state: "CO" },
  { city: "Portland", state: "OR" },
  { city: "Seattle", state: "WA" },
  { city: "San Francisco", state: "CA" },
  { city: "Chicago", state: "IL" },
  { city: "Nashville", state: "TN" },
  { city: "Phoenix", state: "AZ" },
];

export default async function HomePage() {
  const [featuredShops, stats] = await Promise.all([getFeaturedShops(), getStats()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-100" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%,rgba(224,94,24,0.35),transparent)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
            <Bike className="h-4 w-4 text-brand-400" />
            The #1 Bike Shop Directory in the US
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect{" "}
            <span className="text-brand-400">Bike Shop</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Search {stats.shopCount.toLocaleString()}+ bike shops across {stats.cityCount}+ cities. Filter by services,
            bike types, brands, and location to find exactly what you need.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-10 max-w-2xl">
            <SearchBar size="lg" placeholder="City, ZIP code, or shop name…" />
          </div>

          {/* Quick filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {QUICK_FILTERS.map((filter) => (
              <Link
                key={filter.slug}
                href={`/search?${filter.type}=${filter.slug}`}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-slate-300 transition-colors hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-brand-300"
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
            {[
              { icon: MapPin, value: `${stats.shopCount}+`, label: "Bike Shops" },
              { icon: Star, value: "10k+", label: "Reviews" },
              { icon: Shield, value: "100%", label: "Verified Listings" },
              { icon: Wrench, value: "50+", label: "Services Listed" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white px-6 py-8 text-center">
                <Icon className="mx-auto mb-2 h-5 w-5 text-brand-500" />
                <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-brand-500">
                Top Rated
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                Featured Bike Shops
              </h2>
            </div>
            <Link
              href="/search?featured=true"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} featured={shop.isFeatured} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by City */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-brand-500">
              Explore
            </p>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Browse by City
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {POPULAR_CITIES.map(({ city, state }) => (
              <Link
                key={`${city}-${state}`}
                href={`/search?city=${encodeURIComponent(city)}&state=${state}`}
                className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 transition-all hover:border-brand-200 hover:bg-brand-50 hover:shadow-sm"
              >
                <div>
                  <p className="font-semibold text-slate-800 group-hover:text-brand-700">{city}</p>
                  <p className="text-xs text-slate-400">{state}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - List Your Shop */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-700 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Bike className="mx-auto mb-4 h-12 w-12 text-brand-200 opacity-80" />
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Own a Bike Shop?
          </h2>
          <p className="mt-4 text-base text-brand-100 leading-relaxed">
            List your shop on BikeShopsUSA and connect with thousands of cyclists in your area.
            It's free to get started.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 hover:shadow-xl"
            >
              <Bike className="h-4 w-4" />
              List Your Shop — Free
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
