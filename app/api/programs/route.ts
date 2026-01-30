import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { programs } from "@/lib/db/schema/programs";
import {
  and,
  or,
  ilike,
  sql,
  desc,
  count,
  gte,
  lt,
  lte,
  eq,
} from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { uploadStorageFile } from "@/lib/supabase/storage";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const keyword = searchParams.get("keyword");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const isVisible = searchParams.get("isVisible");

    const now = new Date();
    const whereClauses = [];

    // isVisible 필터 (공개/비공개 여부)
    if (isVisible !== null && isVisible !== undefined) {
      whereClauses.push(eq(programs.isVisible, isVisible === "true"));
    }

    // Status 필터: 신청 기간 기준으로 동적 판단
    if (status === "ongoing") {
      // 진행중: 신청 시작일 <= 현재 <= 신청 종료일
      whereClauses.push(
        and(
          lte(programs.applicationStartAt, now),
          gte(programs.applicationEndAt, now)
        )
      );
    } else if (status === "closed") {
      // 종료: 신청 종료일 < 현재
      whereClauses.push(lt(programs.applicationEndAt, now));
    }

    // 연도/월 필터 (달력뷰용)
    if (year && month) {
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);

      whereClauses.push(
        and(
          gte(programs.eventDateTime, startDate),
          lt(programs.eventDateTime, endDate)
        )
      );
    }

    // 키워드 필터
    if (keyword) {
      whereClauses.push(
        or(
          ilike(programs.title, `%${keyword}%`),
          sql`EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${programs.keyword}) AS elem
            WHERE elem ILIKE ${`%${keyword}%`}
          )`
        )
      );
    }

    const whereCondition =
      whereClauses.length > 0 ? and(...whereClauses) : undefined;

    // pagination 여부 확인
    const isPaginated = limit || page;

    if (isPaginated) {
      // page 기반 pagination 처리
      const limitNum = limit ? parseInt(limit) : 10;
      const pageNum = page ? parseInt(page) : 1;
      const offsetNum = offset ? parseInt(offset) : (pageNum - 1) * limitNum;

      const [data, [{ value: totalCount }]] = await Promise.all([
        db.query.programs.findMany({
          where: whereCondition,
          orderBy: [desc(programs.createdAt), desc(programs.id)],
          limit: limitNum,
          offset: offsetNum,
        }),
        db.select({ value: count() }).from(programs).where(whereCondition),
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);
      const hasMore = pageNum < totalPages;

      return NextResponse.json({
        data,
        meta: {
          totalCount,
          totalPages,
          currentPage: pageNum,
          pageSize: limitNum,
          hasMore,
        },
      });
    }

    // 기본: 전체 데이터 + totalCount 반환
    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.programs.findMany({
        where: whereCondition,
        orderBy: [desc(programs.createdAt), desc(programs.id)],
      }),
      db.select({ value: count() }).from(programs).where(whereCondition),
    ]);

    return NextResponse.json({
      data,
      meta: {
        totalCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const eventDateTime = formData.get("eventDateTime") as string;
    const applicationStartDate = formData.get("applicationStartDate") as string;
    const applicationEndDate = formData.get("applicationEndDate") as string;
    const location = formData.get("location") as string;
    const capacity = formData.get("capacity") as string;
    const notes = formData.get("notes") as string;
    const keywords = formData.get("keywords") as string;
    const description = formData.get("description") as string;
    const smartstoreUrl = formData.get("smartstoreUrl") as string;
    const isVisible = formData.get("isVisible") as string;
    const image = formData.get("image") as File;

    if (
      !title ||
      !eventDateTime ||
      !applicationStartDate ||
      !applicationEndDate ||
      !smartstoreUrl ||
      !image
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB)
    if (image && image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 10MB를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let webpBuffer: Buffer;
    let finalFileName = "";
    const timestamp = Date.now();
    const originalName = image.name.replace(/\.[^.]+$/, "");

    try {
      webpBuffer = await sharp(inputBuffer).webp({ quality: 90 }).toBuffer();
      finalFileName = `programs/${timestamp}-${originalName}.webp`;
    } catch (sharpError) {
      webpBuffer = inputBuffer;
      // Use original extension or default to .jpg if unknown, but better to keep original name if possible
      // Here we just use the original filename with a timestamp to avoid collisions
      finalFileName = `programs/${timestamp}-${image.name}`;
    }

    const { url: thumbnailUrl } = await uploadStorageFile(
      "images",
      webpBuffer,
      finalFileName
    );

    const keywordArray = keywords
      ? keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    const eventDate = new Date(eventDateTime);
    const appStartDate = new Date(applicationStartDate);
    const appEndDate = new Date(applicationEndDate);

    if (
      isNaN(eventDate.getTime()) ||
      isNaN(appStartDate.getTime()) ||
      isNaN(appEndDate.getTime())
    ) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const [newProgram] = await db
      .insert(programs)
      .values({
        title,
        eventDateTime: eventDate,
        applicationStartAt: appStartDate,
        applicationEndAt: appEndDate,
        location: location || null,
        capacity:
          capacity && !isNaN(parseInt(capacity)) ? parseInt(capacity) : null,
        notes: notes || null,
        keyword: keywordArray,
        description: description || null,
        smartstoreUrl,
        thumbnailUrl,
        isVisible: isVisible === "true",
      })
      .returning();

    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
