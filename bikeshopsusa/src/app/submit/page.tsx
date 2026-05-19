"use client";
// src/app/submit/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, Check, Loader2 } from "lucide-react";

const SERVICES = ["repair", "tune-up", "bike-fitting", "rentals", "custom-builds", "parts-accessories", "wheel-building", "electric-bike-service"];
const BIKE_TYPES = ["road", "mountain", "gravel", "e-bike", "bmx", "hybrid", "cruiser", "kids"];
const BRANDS = ["trek", "specialized", "giant", "cannondale", "santa-cruz", "shimano", "sram", "scott", "cervelo", "surly", "salsa", "yeti", "orbea", "bianchi", "kona"];

function CheckboxGroup({ label, options, selected, onChange }: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt]);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
              selected.includes(opt)
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
            }`}
          >
            {opt.replace(/-/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SubmitShopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBikeTypes, setSelectedBikeTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", description: "", phone: "", email: "", website: "",
    street: "", city: "", state: "", zip: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First fetch filter IDs
      const filtersRes = await fetch("/api/filters");
      const filters = await filtersRes.json();

      const serviceIds = filters.services
        .filter((s: { slug: string; id: string }) => selectedServices.includes(s.slug))
        .map((s: { id: string }) => s.id);
      const bikeTypeIds = filters.bikeTypes
        .filter((bt: { slug: string; id: string }) => selectedBikeTypes.includes(bt.slug))
        .map((bt: { id: string }) => bt.id);
      const brandIds = filters.brands
        .filter((b: { slug: string; id: string }) => selectedBrands.includes(b.slug))
        .map((b: { id: string }) => b.id);

      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, services: serviceIds, bikeTypes: bikeTypeIds, brands: brandIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");
      setSuccess(true);
      setTimeout(() => router.push(`/shops/${data.slug}`), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500">
            <Bike className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            List Your Bike Shop
          </h1>
          <p className="mt-2 text-slate-500">
            Add your shop to BikeShopsUSA and reach thousands of local cyclists.
          </p>
        </div>

        {success ? (
          <div className="rounded-2xl bg-white p-10 shadow-card text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
              <Check className="h-8 w-8 text-forest-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">Shop Listed!</h2>
            <p className="mt-2 text-slate-500">Redirecting to your shop page…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
              <h2 className="font-display text-base font-bold text-slate-900">Shop Information</h2>

              {[
                { key: "name", label: "Shop Name", required: true, placeholder: "Pedal Power Bikes" },
                { key: "phone", label: "Phone", required: false, placeholder: "(555) 000-0000" },
                { key: "email", label: "Email", required: false, placeholder: "info@yourshop.com" },
                { key: "website", label: "Website", required: false, placeholder: "https://yourshop.com" },
              ].map(({ key, label, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={required}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Tell cyclists what makes your shop special…"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
              <h2 className="font-display text-base font-bold text-slate-900">Address</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  placeholder="123 Main St"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Austin"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                    placeholder="TX"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 uppercase"
                  />
                </div>
              </div>

              <div className="max-w-xs">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  placeholder="78701"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-2xl bg-white p-6 shadow-card space-y-5">
              <h2 className="font-display text-base font-bold text-slate-900">Services & Specialties</h2>
              <CheckboxGroup label="Services Offered" options={SERVICES} selected={selectedServices} onChange={setSelectedServices} />
              <CheckboxGroup label="Bike Types" options={BIKE_TYPES} selected={selectedBikeTypes} onChange={setSelectedBikeTypes} />
              <CheckboxGroup label="Brands Carried" options={BRANDS} selected={selectedBrands} onChange={setSelectedBrands} />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? "Submitting…" : "List My Shop"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
