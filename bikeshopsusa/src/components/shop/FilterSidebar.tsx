"use client";
// src/components/shop/FilterSidebar.tsx
import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { FilterOptions } from "@/types";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: FilterOptions;
  selectedServices: string[];
  selectedBikeTypes: string[];
  selectedBrands: string[];
  selectedState: string;
  onFilterChange: (type: "services" | "bikeTypes" | "brands" | "state", value: string) => void;
  onClearAll: () => void;
  className?: string;
}

interface FilterSectionProps {
  title: string;
  options: { slug: string; name: string }[];
  selected: string[];
  onToggle: (slug: string) => void;
  defaultOpen?: boolean;
}

function FilterSection({ title, options, selected, onToggle, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-slate-700 hover:text-slate-900"
      >
        <span>
          {title}
          {selected.length > 0 && (
            <span className="ml-2 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
              {selected.length}
            </span>
          )}
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {options.map((option) => {
            const isSelected = selected.includes(option.slug);
            return (
              <label
                key={option.slug}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-slate-50"
              >
                <div
                  className={cn(
                    "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors",
                    isSelected
                      ? "border-brand-500 bg-brand-500"
                      : "border-slate-300 bg-white hover:border-brand-400"
                  )}
                >
                  {isSelected && (
                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <span className={cn("text-sm", isSelected ? "font-medium text-slate-900" : "text-slate-600")}>
                  {option.name}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({
  filters,
  selectedServices,
  selectedBikeTypes,
  selectedBrands,
  selectedState,
  onFilterChange,
  onClearAll,
  className,
}: FilterSidebarProps) {
  const totalActive =
    selectedServices.length + selectedBikeTypes.length + selectedBrands.length + (selectedState ? 1 : 0);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-5 shadow-card",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-brand-500" />
          Filters
          {totalActive > 0 && (
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">
              {totalActive}
            </span>
          )}
        </h2>
        {totalActive > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-brand-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* State filter */}
      <div className="border-b border-slate-100 py-4">
        <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
        <select
          value={selectedState}
          onChange={(e) => onFilterChange("state", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All States</option>
          {filters.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <FilterSection
        title="Services"
        options={filters.services}
        selected={selectedServices}
        onToggle={(slug) => onFilterChange("services", slug)}
      />
      <FilterSection
        title="Bike Types"
        options={filters.bikeTypes}
        selected={selectedBikeTypes}
        onToggle={(slug) => onFilterChange("bikeTypes", slug)}
      />
      <FilterSection
        title="Brands"
        options={filters.brands}
        selected={selectedBrands}
        onToggle={(slug) => onFilterChange("brands", slug)}
        defaultOpen={false}
      />
    </aside>
  );
}
