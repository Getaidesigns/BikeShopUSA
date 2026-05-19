// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const favoriteSchema = z.object({
  shopId: z.string(),
  sessionId: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { sessionId },
      include: {
        shop: {
          select: {
            id: true,
            slug: true,
            name: true,
            city: true,
            state: true,
            rating: true,
            isVerified: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("[GET /api/favorites]", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shopId, sessionId } = favoriteSchema.parse(body);

    // Check shop exists
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Toggle favorite
    const existing = await prisma.favorite.findUnique({
      where: { sessionId_shopId: { sessionId, shopId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({ data: { sessionId, shopId } });
      return NextResponse.json({ favorited: true }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("[POST /api/favorites]", error);
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
  }
}
