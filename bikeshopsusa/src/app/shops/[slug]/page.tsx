// src/app/shops/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Phone, Globe, CheckCircle, ArrowLeft,
  Star, Wrench, Bike, Tag as TagIcon, ShoppingBag,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Tag } from "@/components/ui/Tag";
import { StarRating } from "@/components/ui/StarRating";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import ClaimButton from "./ClaimButton";

interface Props {
  params: { slug: string };
}

async function getShop(slug: string) {
  return prisma.shop.findFirst({
    where: { slug, isActive: true },
    include: {
      services: { include: { service: { select: { name: true, slug: true } } } },
      bikeTypes: { include: { bikeType: { select: { name: true, slug: true } } } },
      brands: { include: { brand: { select: { name: true, slug: true } } } },
      accessories: { include: { accessoryType: { select: { name: true, slug: true } } } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shop = await getShop(params.slug);
  if (!shop) return { title: "Shop Not Found" };

  const title = `${shop.name} – Bike Shop in ${shop.city}, ${shop.state}`;
  const description =
    shop.description?.slice(0, 160) ??
    `${shop.name} is a bike shop located in ${shop.city}, ${shop.state}. Services include ${shop.services
      .slice(0, 3)
      .map((s) => s.service.name)
      .join(", ")}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://bikeshopsusa.org/shops/${shop.slug}`,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const shops = await prisma.shop.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return shops.map((s) => ({ slug: s.slug }));
}

export default async function ShopDetailPage({ params }: Props) {
  const shop = await getShop(params.slug);
  if (!shop) notFound();

  const shopImage =
    shop.imageUrl ??
    "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1200&q=80";

  // Schema.org LocalBusiness structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://bikeshopsusa.org/shops/${shop.slug}`,
    name: shop.name,
    description: shop.description,
    telephone: shop.phone,
    email: shop.email,
    url: shop.website,
    image: shopImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.street,
      addressLocality: shop.city,
      addressRegion: shop.state,
      postalCode: shop.zip,
      addressCountry: shop.country,
    },
    ...(shop.latitude && shop.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: shop.latitude,
            longitude: shop.longitude,
          },
        }
      : {}),
    ...(shop.rating && shop.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: shop.rating,
            reviewCount: shop.reviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Hero image */}
        <div className="relative h-56 bg-slate-900 sm:h-72 overflow-hidden">
          <img
            src={shopImage}
            alt={shop.name}
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

          {/* Back button */}
          <div className="absolute left-4 top-4 sm:left-6">
            <Link
              href="/search"
              className="flex items-center gap-1.5 rounded-lg bg-black/30 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to results
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Shop header card */}
          <div className="-mt-16 relative z-10 mb-6">
            <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {shop.isVerified && (
                      <span className="flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1 text-xs font-semibold text-forest-700">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                    {shop.isFeatured && (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                    {shop.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-brand-400" />
                      {shop.street}, {shop.city}, {shop.state} {shop.zip}
                    </span>
                    {shop.phone && (
                      <a
                        href={`tel:${shop.phone}`}
                        className="flex items-center gap-1 hover:text-brand-500 transition-colors"
                      >
                        <Phone className="h-4 w-4 text-brand-400" />
                        {shop.phone}
                      </a>
                    )}
                  </div>

                  {shop.rating && shop.reviewCount > 0 && (
                    <div className="mt-3">
                      <StarRating rating={shop.rating} reviewCount={shop.reviewCount} size="md" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  {shop.website && (
                    <a
                      href={shop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  )}
                  {shop.phone && (
                    <a
                      href={`tel:${shop.phone}`}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Phone className="h-4 w-4" />
                      Call Shop
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Description */}
              {shop.description && (
                <section className="rounded-2xl bg-white p-6 shadow-card">
                  <h2 className="mb-3 font-display text-lg font-bold text-slate-900">About</h2>
                  <p className="text-sm leading-relaxed text-slate-600">{shop.description}</p>
                </section>
              )}

              {/* Services */}
              {shop.services.length > 0 && (
                <section className="rounded-2xl bg-white p-6 shadow-card">
                  <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <Wrench className="h-5 w-5 text-brand-500" />
                    Services Offered
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {shop.services.map((s) => (
                      <Tag key={s.service.slug} label={s.service.name} variant="service" size="md" />
                    ))}
                  </div>
                </section>
              )}

              {/* Bike Types */}
              {shop.bikeTypes.length > 0 && (
                <section className="rounded-2xl bg-white p-6 shadow-card">
                  <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <Bike className="h-5 w-5 text-forest-600" />
                    Bike Types
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {shop.bikeTypes.map((bt) => (
                      <Tag key={bt.bikeType.slug} label={bt.bikeType.name} variant="biketype" size="md" />
                    ))}
                  </div>
                </section>
              )}

              {/* Brands */}
              {shop.brands.length > 0 && (
                <section className="rounded-2xl bg-white p-6 shadow-card">
                  <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <TagIcon className="h-5 w-5 text-blue-500" />
                    Brands Carried
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {shop.brands.map((b) => (
                      <Tag key={b.brand.slug} label={b.brand.name} variant="brand" size="md" />
                    ))}
                  </div>
                </section>
              )}

              {/* Accessories */}
              {shop.accessories.length > 0 && (
                <section className="rounded-2xl bg-white p-6 shadow-card">
                  <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <ShoppingBag className="h-5 w-5 text-purple-500" />
                    Accessories & Gear
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {shop.accessories.map((a) => (
                      <Tag key={a.accessoryType.slug} label={a.accessoryType.name} variant="accessory" size="md" />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Map */}
              <section className="rounded-2xl bg-white p-4 shadow-card">
                <h2 className="mb-3 font-display text-base font-bold text-slate-900">Location</h2>
                <MapPlaceholder
                  singleShop={{
                    id: shop.id,
                    name: shop.name,
                    city: shop.city,
                    state: shop.state,
                    latitude: shop.latitude,
                    longitude: shop.longitude,
                  }}
                  height="h-52"
                />
                <p className="mt-3 text-sm text-slate-500">
                  {shop.street}<br />
                  {shop.city}, {shop.state} {shop.zip}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${shop.name} ${shop.street} ${shop.city} ${shop.state}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </a>
              </section>

              {/* Contact card */}
              <section className="rounded-2xl bg-white p-5 shadow-card">
                <h2 className="mb-3 font-display text-base font-bold text-slate-900">Contact</h2>
                <div className="space-y-2 text-sm text-slate-600">
                  {shop.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <a href={`tel:${shop.phone}`} className="hover:text-brand-500 transition-colors">
                        {shop.phone}
                      </a>
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${shop.email}`} className="hover:text-brand-500 transition-colors truncate">
                        {shop.email}
                      </a>
                    </div>
                  )}
                  {shop.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-slate-400" />
                      <a
                        href={shop.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-500 transition-colors truncate"
                      >
                        {shop.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* Claim */}
              <ClaimButton shopId={shop.id} shopName={shop.name} isVerified={shop.isVerified} />
            </div>
          </div>
        </div>

        <div className="py-10" />
      </div>
    </>
  );
}
