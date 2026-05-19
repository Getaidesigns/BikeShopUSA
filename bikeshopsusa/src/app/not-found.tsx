// src/app/not-found.tsx
import Link from "next/link";
import { Bike } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Bike className="mb-4 h-16 w-16 text-slate-200" />
      <h1 className="font-display text-4xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-lg text-slate-500">Page not found</p>
      <p className="mt-1 text-sm text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/search"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Find Shops
        </Link>
      </div>
    </div>
  );
}
