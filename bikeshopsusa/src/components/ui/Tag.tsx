// src/components/ui/Tag.tsx
import { cn } from "@/lib/utils";

type TagVariant = "service" | "biketype" | "brand" | "accessory" | "default";

interface TagProps {
  label: string;
  variant?: TagVariant;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  service: "bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100",
  biketype: "bg-forest-50 text-forest-700 border-forest-200 hover:bg-forest-100",
  brand: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  accessory: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  default: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
};

export function Tag({ label, variant = "default", size = "sm", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
