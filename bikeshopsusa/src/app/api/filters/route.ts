// src/app/api/filters/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [services, bikeTypes, brands, accessories, statesResult] = await Promise.all([
      prisma.service.findMany({ orderBy: { name: "asc" } }),
      prisma.bikeType.findMany({ orderBy: { name: "asc" } }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      prisma.accessoryType.findMany({ orderBy: { name: "asc" } }),
      prisma.shop.findMany({
        where: { isActive: true },
        select: { state: true },
        distinct: ["state"],
        orderBy: { state: "asc" },
      }),
    ]);

    return NextResponse.json({
      services,
      bikeTypes,
      brands,
      accessories,
      states: statesResult.map((r) => r.state),
    });
  } catch (error) {
    console.error("[GET /api/filters]", error);
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }
}
