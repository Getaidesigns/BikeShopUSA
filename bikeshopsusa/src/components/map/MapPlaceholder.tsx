"use client";
// src/components/map/MapPlaceholder.tsx
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapShop {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
}

interface MapPlaceholderProps {
  shops?: MapShop[];
  singleShop?: MapShop;
  className?: string;
  height?: string;
}

export function MapPlaceholder({ shops = [], singleShop, className, height = "h-80" }: MapPlaceholderProps) {
  const displayShops = singleShop ? [singleShop] : shops;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100",
        height,
        className
      )}
    >
      {/* Grid overlay for map feel */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,116,139,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,116,139,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Road lines */}
      <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <line x1="20%" y1="0" x2="35%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="50%" y1="0" x2="60%" y2="100%" stroke="#94a3b8" strokeWidth="3" />
        <line x1="75%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="0" y1="30%" x2="100%" y2="25%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="0" y1="65%" x2="100%" y2="60%" stroke="#94a3b8" strokeWidth="3" />
      </svg>

      {/* Shop pins */}
      {displayShops.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-wrap gap-6 p-4">
            {displayShops.slice(0, 6).map((shop, i) => (
              <div
                key={shop.id}
                className="flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 shadow-lg ring-2 ring-white">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-brand-500" />
                </div>
                <div className="mt-3 rounded-lg bg-white px-2.5 py-1.5 shadow-md text-center max-w-[120px]">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate">{shop.name}</p>
                  <p className="text-xs text-slate-500">{shop.city}, {shop.state}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {displayShops.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-400">Map view</p>
            <p className="text-xs text-slate-300">Search to see shops near you</p>
          </div>
        </div>
      )}

      {/* Map attribution badge */}
      <div className="absolute bottom-2 right-2 rounded bg-white/80 px-2 py-1 text-xs text-slate-400">
        Map view coming soon
      </div>

      {/* Shop count badge */}
      {displayShops.length > 0 && (
        <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1.5 shadow text-xs font-semibold text-slate-700">
          {displayShops.length} shop{displayShops.length !== 1 ? "s" : ""} in view
        </div>
      )}
    </div>
  );
}
