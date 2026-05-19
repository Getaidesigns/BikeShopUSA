"use client";
// src/app/search/SearchContent.tsx
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, Map, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ShopCard } from "@/components/shop/ShopCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { FilterOptions, PaginatedShops } from "@/types";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "map";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [results, setResults] = useState<PaginatedShops | null>(null);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Derived state from URL
  const q = searchParams.get("q") ?? "";
  const city = searchParams.get("city") ?? "";
  const state = searchParams.get("state") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const services = searchParams.getAll("services");
  const bikeTypes = searchParams.getAll("bikeTypes");
  const brands = searchParams.getAll("brands");

  const updateUrl = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (value) {
            params.set(key, value);
          }
        }
      }

      // Reset page on filter change
      if (!("page" in updates)) params.set("page", "1");
      router.push(`/search?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const handleFilterChange = (
    type: "services" | "bikeTypes" | "brands" | "state",
    value: string
  ) => {
    if (type === "state") {
      updateUrl({ state: value });
      return;
    }

    const current =
      type === "services" ? services : type === "bikeTypes" ? bikeTypes : brands;

    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    updateUrl({ [type]: next });
  };

  const handleClearAll = () => {
    router.push("/search");
  };

  // Fetch filter options once
  useEffect(() => {
    fetch("/api/filters")
      .then((r) => r.json())
      .then(setFilters)
      .catch(console.error);
  }, []);

  // Fetch shops on param change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    if (page > 1) params.set("page", String(page));
    services.forEach((s) => params.append("services", s));
    bikeTypes.forEach((bt) => params.append("bikeTypes", bt));
    brands.forEach((b) => params.append("brands", b));

    fetch(`/api/shops?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [q, city, state, page, services.join(","), bikeTypes.join(","), brands.join(",")]);

  const totalActive = services.length + bikeTypes.length + brands.length + (state ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search header */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SearchBar
            defaultValue={q}
            onSearch={(val) => updateUrl({ q: val })}
            size="md"
          />
          {/* Active filter chips */}
          {totalActive > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {state && (
                <button
                  onClick={() => updateUrl({ state: null })}
                  className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-200"
                >
                  State: {state} <X className="h-3 w-3" />
                </button>
              )}
              {services.map((s) => (
                <button
                  key={s}
                  onClick={() => handleFilterChange("services", s)}
                  className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-200"
                >
                  {s} <X className="h-3 w-3" />
                </button>
              ))}
              {bikeTypes.map((bt) => (
                <button
                  key={bt}
                  onClick={() => handleFilterChange("bikeTypes", bt)}
                  className="flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-700 hover:bg-forest-200"
                >
                  {bt} <X className="h-3 w-3" />
                </button>
              ))}
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => handleFilterChange("brands", b)}
                  className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                >
                  {b} <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={handleClearAll}
                className="text-xs text-slate-400 hover:text-brand-500 transition-colors px-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Toolbar */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {totalActive > 0 && (
                <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
                  {totalActive}
                </span>
              )}
            </button>

            <p className="text-sm text-slate-500">
              {loading ? (
                "Searching…"
              ) : (
                <>
                  <span className="font-semibold text-slate-800">{results?.total ?? 0}</span> shops found
                  {q && ` for "${q}"`}
                  {city && ` in ${city}`}
                </>
              )}
            </p>
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === "grid"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setView("map")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === "map"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - desktop */}
          {filters && (
            <div className="hidden w-64 flex-shrink-0 lg:block">
              <FilterSidebar
                filters={filters}
                selectedServices={services}
                selectedBikeTypes={bikeTypes}
                selectedBrands={brands}
                selectedState={state}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
              />
            </div>
          )}

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Map view */}
            {view === "map" && (
              <div className="mb-6">
                <MapPlaceholder
                  shops={results?.shops ?? []}
                  height="h-96"
                  className="w-full"
                />
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-slate-200 h-80" />
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && results && (
              <>
                {results.shops.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
                    <p className="font-display text-lg font-bold text-slate-700">No shops found</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Try adjusting your filters or search in a different area.
                    </p>
                    <button
                      onClick={handleClearAll}
                      className="mt-4 rounded-lg bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-100"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {results.shops.map((shop) => (
                      <ShopCard key={shop.id} shop={shop} featured={shop.isFeatured} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {results.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => updateUrl({ page: String(page - 1) })}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, results.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateUrl({ page: String(pageNum) })}
                            className={cn(
                              "h-9 w-9 rounded-lg text-sm font-medium transition-colors",
                              pageNum === page
                                ? "bg-brand-500 text-white shadow-sm"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={page >= results.totalPages}
                      onClick={() => updateUrl({ page: String(page + 1) })}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && filters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full overflow-y-auto bg-white p-4 shadow-xl animate-slide-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-slate-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-1.5 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              selectedServices={services}
              selectedBikeTypes={bikeTypes}
              selectedBrands={brands}
              selectedState={state}
              onFilterChange={(type, value) => {
                handleFilterChange(type, value);
              }}
              onClearAll={() => {
                handleClearAll();
                setMobileFiltersOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
