import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { banners } from "@/lib/db/schema/banners";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await db.query.banners.findFirst({
      where: eq(banners.id, id),
    });

    if (!data) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      type,
      imageUrl,
      linkUrl,
      isActive,
      displayOrder,
      startDate,
      endDate,
    } = body;

    const updatedBanner = await db
      .update(banners)
      .set({
        title,
        type,
        imageUrl,
        linkUrl,
        isActive,
        displayOrder,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(banners.id, id))
      .returning();

    if (!updatedBanner.length) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBanner[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deletedBanner = await db
      .delete(banners)
      .where(eq(banners.id, id))
      .returning();

    if (!deletedBanner.length) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
