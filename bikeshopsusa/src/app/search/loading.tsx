// src/app/search/loading.tsx
export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex gap-6">
          <div className="hidden w-64 lg:block">
            <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
          </div>
          <div className="flex-1">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
