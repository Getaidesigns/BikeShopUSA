"use client";
// src/components/shop/ShopCard.tsx
import Link from "next/link";
import { MapPin, Phone, Globe, CheckCircle, Heart } from "lucide-react";
import { ShopSummary } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import { useFavorite } from "@/hooks/useFavorite";

interface ShopCardProps {
  shop: ShopSummary;
  featured?: boolean;
  className?: string;
}

const BIKE_IMAGES: Record<string, string> = {
  "road": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "mountain": "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600&q=80",
  "gravel": "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80",
  "e-bike": "https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80",
  "default": "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&q=80",
};

function getShopImage(shop: ShopSummary): string {
  if (shop.imageUrl) return shop.imageUrl;
  const firstBike = shop.bikeTypes[0]?.bikeType.slug;
  return BIKE_IMAGES[firstBike ?? "default"] ?? BIKE_IMAGES.default;
}

export function ShopCard({ shop, featured = false, className }: ShopCardProps) {
  const { favorited, toggle } = useFavorite(shop.id);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        featured && "ring-2 ring-brand-400 ring-offset-2",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={getShopImage(shop)}
          alt={shop.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {featured && (
            <span className="rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white shadow">
              ★ Featured
            </span>
          )}
          {shop.isVerified && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-forest-700">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-all hover:scale-110 active:scale-95",
            favorited ? "text-red-500" : "text-slate-400 hover:text-red-400"
          )}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className="h-4 w-4" fill={favorited ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-tight text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {shop.name}
          </h3>
          <StarRating rating={shop.rating} reviewCount={shop.reviewCount} size="sm" />
        </div>

        <p className="mb-3 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-brand-400" />
          {shop.city}, {shop.state} · {shop.zip}
        </p>

        {/* Description */}
        {shop.description && (
          <p className="mb-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {shop.description}
          </p>
        )}

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {shop.services.slice(0, 3).map((s) => (
            <Tag key={s.service.slug} label={s.service.name} variant="service" size="sm" />
          ))}
          {shop.bikeTypes.slice(0, 2).map((bt) => (
            <Tag key={bt.bikeType.slug} label={bt.bikeType.name} variant="biketype" size="sm" />
          ))}
          {shop.services.length + shop.bikeTypes.length > 5 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
              +{shop.services.length + shop.bikeTypes.length - 5} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex gap-3">
            {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-brand-500 transition-colors"
                aria-label={`Call ${shop.name}`}
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
            )}
            {shop.website && (
              <a
                href={shop.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-brand-500 transition-colors"
                aria-label={`Visit ${shop.name} website`}
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <Link
            href={`/shops/${shop.slug}`}
            className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-100"
          >
            View Shop →
          </Link>
        </div>
      </div>
    </article>
  );
}
