// src/components/ui/StarRating.tsx
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number | null;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({ rating, reviewCount, size = "sm", className }: StarRatingProps) {
  const r = rating ?? 0;
  const stars = [1, 2, 3, 4, 5];

  const starSize = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = star <= Math.floor(r);
          const half = !filled && star <= r + 0.5;

          return (
            <svg
              key={star}
              className={cn(starSize, filled || half ? "text-amber-400" : "text-slate-200")}
              fill={filled ? "currentColor" : half ? "url(#half)" : "none"}
              stroke="currentColor"
              strokeWidth={filled || half ? "0" : "1.5"}
              viewBox="0 0 24 24"
            >
              {half && (
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
              )}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          );
        })}
      </div>
      {r > 0 && (
        <span className={cn("font-semibold text-slate-800", textSize)}>{r.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className={cn("text-slate-400", textSize)}>({reviewCount})</span>
      )}
    </div>
  );
}
