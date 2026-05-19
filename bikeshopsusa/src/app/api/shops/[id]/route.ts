// src/app/api/shops/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const shopIncludeFull = {
  services: { include: { service: { select: { id: true, name: true, slug: true } } } },
  bikeTypes: { include: { bikeType: { select: { id: true, name: true, slug: true } } } },
  brands: { include: { brand: { select: { id: true, name: true, slug: true } } } },
  accessories: { include: { accessoryType: { select: { id: true, name: true, slug: true } } } },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Support both ID and slug lookup
    const shop = await prisma.shop.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        isActive: true,
      },
      include: shopIncludeFull,
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("[GET /api/shops/:id]", error);
    return NextResponse.json({ error: "Failed to fetch shop" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    
    const shop = await prisma.shop.update({
      where: { id: params.id },
      data: body,
      include: shopIncludeFull,
    });

    return NextResponse.json(shop);
  } catch (error) {
    console.error("[PATCH /api/shops/:id]", error);
    return NextResponse.json({ error: "Failed to update shop" }, { status: 500 });
  }
}
