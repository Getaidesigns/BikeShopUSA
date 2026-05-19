"use client";
// src/components/ui/SearchBar.tsx
import { useState, FormEvent } from "react";
import { Search, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onSearch?: (value: string) => void;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search by city, ZIP code, or shop name…",
  size = "md",
  className,
  onSearch,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    } else {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.push(`/search?${params.toString()}`);
    }
  };

  const sizeStyles = {
    sm: "h-10 text-sm",
    md: "h-12 text-base",
    lg: "h-14 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex w-full", className)}>
      <div className="relative flex-1">
        <MapPin
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-brand-500",
            iconSizes[size]
          )}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-l-xl border border-r-0 border-slate-200 bg-white pl-10 pr-10 font-sans text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
            sizeStyles[size]
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className={cn(
          "flex items-center gap-2 rounded-r-xl bg-brand-500 px-5 font-semibold text-white transition-colors hover:bg-brand-600 active:bg-brand-700",
          sizeStyles[size]
        )}
      >
        <Search className={iconSizes[size]} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}
