import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // ✅ SIMPLE FILTER (no helpers, no toArray, no brand logic yet)
    const where: Prisma.ShopWhereInput = {
      isActive: true,
      ...(category ? { category } : {}),
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const shops = await prisma.shop.findMany({
      where,
    });

    return Response.json(shops);
  } catch (error) {
    console.error("API /shops error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}