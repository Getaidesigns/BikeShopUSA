"use client";
// src/app/shops/[slug]/ClaimButton.tsx
import { useState } from "react";
import { Shield, X, Check, Loader2 } from "lucide-react";

interface ClaimButtonProps {
  shopId: string;
  shopName: string;
  isVerified: boolean;
}

interface FormState {
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  message: string;
}

export default function ClaimButton({ shopId, shopName, isVerified }: ClaimButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/shops/${shopId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimantName: form.claimantName,
          claimantEmail: form.claimantEmail,
          claimantPhone: form.claimantPhone || undefined,
          message: form.message || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) return null;

  return (
    <>
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
        <Shield className="mb-2 h-6 w-6 text-slate-400" />
        <h3 className="font-display text-sm font-bold text-slate-700">Is this your shop?</h3>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          Claim this listing to update your information, respond to reviews, and get a verified badge.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-3 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          Claim This Shop
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !loading && setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-slide-up">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Claim Listing</h2>
                <p className="mt-1 text-sm text-slate-500">{shopName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
                  <Check className="h-6 w-6 text-forest-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900">Claim Submitted!</h3>
                <p className="mt-2 text-sm text-slate-500">
                  We'll review your claim and get back to you within 2-3 business days.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.claimantName}
                    onChange={(e) => setForm({ ...form, claimantName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.claimantEmail}
                    onChange={(e) => setForm({ ...form, claimantEmail: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="you@yourshop.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={form.claimantPhone}
                    onChange={(e) => setForm({ ...form, claimantPhone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Message (optional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
                    placeholder="Tell us how you're associated with this shop…"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Submitting…" : "Submit Claim"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
