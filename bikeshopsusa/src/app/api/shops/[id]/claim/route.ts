// src/app/api/shops/[id]/claim/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const claimSchema = z.object({
  claimantName: z.string().min(2).max(100),
  claimantEmail: z.string().email(),
  claimantPhone: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = claimSchema.parse(body);

    // Check shop exists
    const shop = await prisma.shop.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        isActive: true,
      },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Check for existing pending claim
    const existingClaim = await prisma.claim.findFirst({
      where: {
        shopId: shop.id,
        status: "PENDING",
      },
    });

    if (existingClaim) {
      return NextResponse.json(
        { error: "A claim for this shop is already pending review" },
        { status: 409 }
      );
    }

    const claim = await prisma.claim.create({
      data: {
        shopId: shop.id,
        ...data,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, claimId: claim.id, message: "Your claim has been submitted for review." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: error.errors }, { status: 400 });
    }
    console.error("[POST /api/shops/:id/claim]", error);
    return NextResponse.json({ error: "Failed to submit claim" }, { status: 500 });
  }
}
