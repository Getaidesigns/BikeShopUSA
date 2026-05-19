// src/app/api/shops/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toArray } from "@/lib/utils";
import { z } from "zod";

const querySchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  services: z.union([z.string(), z.array(z.string())]).optional(),
  bikeTypes: z.union([z.string(), z.array(z.string())]).optional(),
  brands: z.union([z.string(), z.array(z.string())]).optional(),
  featured: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

const shopInclude = {
  services: { include: { service: { select: { name: true, slug: true } } } },
  bikeTypes: { include: { bikeType: { select: { name: true, slug: true } } } },
  brands: { include: { brand: { select: { name: true, slug: true } } } },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const rawParams: Record<string, string | string[]> = {};
    
    for (const key of searchParams.keys()) {
      const values = searchParams.getAll(key);
      rawParams[key] = values.length === 1 ? values[0] : values;
    }

    const params = querySchema.parse(rawParams);
    const page = Math.max(1, parseInt(params.page ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(params.limit ?? "12")));
    const skip = (page - 1) * limit;

    const serviceFilters = toArray(params.services);
    const bikeTypeFilters = toArray(params.bikeTypes);
    const brandFilters = toArray(params.brands);

    // Build AND-combined filter
    const where: Parameters<typeof prisma.shop.findMany>[0]["where"] = {
      isActive: true,
    };

    // Text search
    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: "insensitive" } },
        { description: { contains: params.q, mode: "insensitive" } },
        { city: { contains: params.q, mode: "insensitive" } },
      ];
    }

    // Location filters
    if (params.city) where.city = { contains: params.city, mode: "insensitive" };
    if (params.state) where.state = { equals: params.state.toUpperCase() };
    if (params.zip) where.zip = { startsWith: params.zip };
    if (params.featured === "true") where.isFeatured = true;

    // Multi-select AND filters
    if (serviceFilters.length > 0) {
      where.services = {
        some: {
          service: { slug: { in: serviceFilters } },
        },
      };
    }

    if (bikeTypeFilters.length > 0) {
      where.bikeTypes = {
        some: {
          bikeType: { slug: { in: bikeTypeFilters } },
        },
      };
    }

    if (brandFilters.length > 0) {
      where.brands = {
        some: {
          brand: { slug: { in: brandFilters } },
        },
      };
    }

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        include: shopInclude,
        skip,
        take: limit,
        orderBy: [
          { isFeatured: "desc" },
          { isVerified: "desc" },
          { rating: "desc" },
          { name: "asc" },
        ],
      }),
      prisma.shop.count({ where }),
    ]);

    return NextResponse.json({
      shops,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET /api/shops]", error);
    return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, description, phone, email, website,
      street, city, state, zip, latitude, longitude,
      services: serviceIds = [],
      bikeTypes: bikeTypeIds = [],
      brands: brandIds = [],
    } = body;

    if (!name || !street || !city || !state || !zip) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${city.toLowerCase()}`
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const shop = await prisma.shop.create({
      data: {
        slug,
        name, description, phone, email, website,
        street, city, state, zip,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        services: {
          create: serviceIds.map((id: string) => ({ serviceId: id })),
        },
        bikeTypes: {
          create: bikeTypeIds.map((id: string) => ({ bikeTypeId: id })),
        },
        brands: {
          create: brandIds.map((id: string) => ({ brandId: id })),
        },
      },
      include: shopInclude,
    });

    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    console.error("[POST /api/shops]", error);
    return NextResponse.json({ error: "Failed to create shop" }, { status: 500 });
  }
}
