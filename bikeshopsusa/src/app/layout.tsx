// src/app/layout.tsx
import type { Metadata } from "next";
import { Sora, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BikeShopsUSA – Find Bike Shops Near You",
    template: "%s | BikeShopsUSA",
  },
  description:
    "Discover and connect with bike shops across the United States. Search by location, bike type, services, and brands.",
  keywords: ["bike shop", "bicycle shop", "bike repair", "cycling", "mountain bike", "road bike"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bikeshopsusa.org",
    siteName: "BikeShopsUSA",
    title: "BikeShopsUSA – Find Bike Shops Near You",
    description: "Discover and connect with bike shops across the United States.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BikeShopsUSA – Find Bike Shops Near You",
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "https://bikeshopsusa.org"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${libreBaskerville.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
