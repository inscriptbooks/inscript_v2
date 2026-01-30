import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { banners, bannerTypeEnum } from "@/lib/db/schema/banners";
import { and, eq, desc, lte, gte, or, isNull, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");
    const date = searchParams.get("date");
    const whereClauses = [];

    if (type)
      whereClauses.push(
        eq(banners.type, type as (typeof bannerTypeEnum.enumValues)[number])
      );
    if (isActive !== null && isActive !== undefined) {
      whereClauses.push(eq(banners.isActive, isActive === "true"));
    }

    // date 파라미터가 있으면 start_date <= date <= end_date 필터링
    if (date) {
      const filterDate = new Date(date);
      whereClauses.push(
        and(
          or(isNull(banners.startDate), lte(banners.startDate, filterDate)),
          or(isNull(banners.endDate), gte(banners.endDate, filterDate))
        )
      );
    }

    const data = await db.query.banners.findMany({
      where: whereClauses.length > 0 ? and(...whereClauses) : undefined,
      orderBy: [asc(banners.displayOrder), asc(banners.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      type,
      imageUrl,
      linkUrl,
      isActive,
      displayOrder,
      startDate,
      endDate,
    } = body;

    const newBanner = await db
      .insert(banners)
      .values({
        id,
        title,
        type,
        imageUrl,
        linkUrl,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      })
      .returning();

    return NextResponse.json(newBanner[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
