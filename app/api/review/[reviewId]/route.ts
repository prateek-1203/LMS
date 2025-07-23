import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH: Update a review
export async function PATCH(
  req: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || !comment) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const existing = await db.review.findUnique({
      where: { id: params.reviewId },
    });

    if (!existing) return new NextResponse("Review not found", { status: 404 });
    if (existing.userId !== userId)
      return new NextResponse("Forbidden", { status: 403 });

    await db.review.update({
      where: { id: params.reviewId },
      data: {
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REVIEW PATCH ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: Delete a review
export async function DELETE(
  req: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const existing = await db.review.findUnique({
      where: { id: params.reviewId },
    });

    if (!existing) return new NextResponse("Review not found", { status: 404 });
    if (existing.userId !== userId)
      return new NextResponse("Forbidden", { status: 403 });

    await db.review.delete({
      where: { id: params.reviewId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REVIEW DELETE ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
