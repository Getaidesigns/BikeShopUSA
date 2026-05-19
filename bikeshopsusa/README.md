# BikeShopsUSA.org 🚲

A production-ready bike shop directory platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL via Prisma**.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/bikeshopsusa.git
cd bikeshopsusa
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your database URL:

```env
DATABASE_URL="postgresql://user:password@host:5432/bikeshopsusa?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### 3. Set Up Database

```bash
# Push schema to your database
npm run db:push

# Seed with 10 example bike shops
npm run db:seed
```

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Options (Free Tiers)

Pick any PostgreSQL provider — paste the connection string into `DATABASE_URL`:

| Provider | Free Tier | Link |
|----------|-----------|------|
| **Neon** ✅ Recommended | 512MB | [neon.tech](https://neon.tech) |
| **Supabase** | 500MB | [supabase.com](https://supabase.com) |
| **Railway** | $5 credit | [railway.app](https://railway.app) |
| **Vercel Postgres** | 256MB | [vercel.com/storage](https://vercel.com/storage) |

---

## ☁️ Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bikeshopsusa.git
git push -u origin main
```

### Step 2 — Create Vercel Project

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Vercel auto-detects Next.js — leave build settings as-is

### Step 3 — Add Environment Variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random 32-char string |

### Step 4 — Deploy

Click **Deploy**. Vercel runs `prisma generate && next build` automatically.

### Step 5 — Seed the Database

After first deploy, run the seed script locally (pointing to your production DB):

```bash
# Temporarily set your production DATABASE_URL in .env, then:
npm run db:seed
```

Or use [Prisma Studio](https://www.prisma.io/studio) to add data manually:

```bash
npm run db:studio
```

---

## 📁 Project Structure

```
bikeshopsusa/
├── prisma/
│   ├── schema.prisma        # Full normalized DB schema
│   └── seed.ts              # 10 example bike shops
├── src/
│   ├── app/
│   │   ├── page.tsx         # Home page
│   │   ├── search/          # Search + filter results page
│   │   ├── shops/[slug]/    # Shop detail page (SEO + Schema.org)
│   │   ├── submit/          # Submit a new shop
│   │   └── api/
│   │       ├── shops/       # GET list, POST create, GET/:id, POST/:id/claim
│   │       ├── favorites/   # Session-based favorites toggle
│   │       └── filters/     # All filter options
│   ├── components/
│   │   ├── layout/          # Header, Footer
│   │   ├── shop/            # ShopCard, FilterSidebar
│   │   ├── map/             # MapPlaceholder
│   │   └── ui/              # Tag, StarRating, SearchBar
│   ├── hooks/
│   │   └── useFavorite.ts   # Session-based favorites hook
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   └── utils.ts         # Helpers, cn(), formatters
│   └── types/
│       └── index.ts         # Shared TypeScript types
├── .env.example
├── vercel.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/shops` | List shops with filters & pagination |
| `POST` | `/api/shops` | Create a new shop listing |
| `GET` | `/api/shops/:id` | Get single shop (by ID or slug) |
| `POST` | `/api/shops/:id/claim` | Submit a claim for a shop |
| `GET` | `/api/filters` | Get all filter options |
| `GET` | `/api/favorites?sessionId=` | Get session favorites |
| `POST` | `/api/favorites` | Toggle a favorite |

### Filter Query Parameters (`GET /api/shops`)

```
?q=austin              # text search
&city=Denver           # city filter
&state=CO              # state filter
&zip=80202             # zip filter
&services=repair       # multi: &services=repair&services=tune-up
&bikeTypes=mountain    # multi: &bikeTypes=mountain&bikeTypes=road
&brands=trek           # multi: &brands=trek&brands=specialized
&featured=true         # featured only
&page=1&limit=12       # pagination
```

---

## 🗂️ Database Schema

```
Shop ──< ShopService >── Service
     ──< ShopBikeType >── BikeType
     ──< ShopBrand >── Brand
     ──< ShopAccessory >── AccessoryType
     ──< Favorite (sessionId or userId)
     ──< Claim (PENDING | APPROVED | REJECTED)
User ──< Favorite
     ──< Claim
```

---

## 🛠️ NPM Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:push      # Push schema (no migration files)
npm run db:migrate   # Create + run migration
npm run db:seed      # Seed 10 example shops
npm run db:studio    # Open Prisma Studio GUI
npm run db:generate  # Regenerate Prisma client
```

---

## 🗺️ Adding Real Map Integration

The `MapPlaceholder` component is ready to swap for Mapbox or Google Maps:

1. Get a [Mapbox token](https://mapbox.com) (free tier available)
2. Add to Vercel env vars: `NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...`
3. Replace `src/components/map/MapPlaceholder.tsx` with a real Mapbox GL JS implementation

---

## ✅ Features

- 🔍 Full-text search by name, city, description
- 🗂️ Multi-select AND filtering (services, bike types, brands, state)
- 📄 Paginated results (12 per page)
- 🗺️ Map view placeholder (swap-ready for Mapbox)
- ❤️ Session-based favorites (no auth required)
- 🏪 Shop detail pages with Schema.org LocalBusiness JSON-LD
- 📝 Submit new shop form
- 🔒 Claim listing workflow (stores pending approval)
- 📱 Fully responsive — sidebar on desktop, drawer on mobile
- ⚡ ISR (Incremental Static Regeneration) on home page
- 🎨 Clean design system with Tailwind + custom tokens
