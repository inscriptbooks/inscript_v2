import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { programApplications } from "@/lib/db/schema/programApplications";
import { programs } from "@/lib/db/schema/programs";
import { eq, and, desc, count } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

// POST /api/programs/[id]/applications - 프로그램 신청
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;
    const body = await request.json();

    const { name, email, phone, agreeTerms, agreePrivacy, agreeMarketing } =
      body;

    // 로그인 확인 (필수)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 필수 필드 검증
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone" },
        { status: 400 }
      );
    }

    if (!agreeTerms || !agreePrivacy) {
      return NextResponse.json(
        { error: "Terms and privacy agreement required" },
        { status: 400 }
      );
    }

    // 프로그램 존재 확인
    const program = await db.query.programs.findFirst({
      where: eq(programs.id, programId),
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // 신청 기간 확인
    const now = new Date();
    const applicationStart = new Date(program.applicationStartAt);
    const applicationEnd = new Date(program.applicationEndAt);

    if (now < applicationStart) {
      return NextResponse.json(
        { error: "Application period has not started" },
        { status: 400 }
      );
    }

    if (now > applicationEnd) {
      return NextResponse.json(
        { error: "Application period has ended" },
        { status: 400 }
      );
    }

    // 중복 신청 확인 (같은 이메일로 이미 신청한 경우)
    const existingApplication = await db.query.programApplications.findFirst({
      where: and(
        eq(programApplications.programId, programId),
        eq(programApplications.email, email)
      ),
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Already applied to this program" },
        { status: 400 }
      );
    }

    // 신청 생성
    const [application] = await db
      .insert(programApplications)
      .values({
        programId,
        userId,
        name,
        email,
        phone,
        agreeTerms: agreeTerms.toString(),
        agreePrivacy: agreePrivacy.toString(),
        agreeMarketing: agreeMarketing.toString(),
        status: "submitted",
      })
      .returning();

    // 프로그램의 applicationCount 증가
    await db
      .update(programs)
      .set({
        applicationCount: program.applicationCount + 1,
      })
      .where(eq(programs.id, programId));

    // 프로그램 정보와 함께 반환
    const applicationWithRelations =
      await db.query.programApplications.findFirst({
        where: eq(programApplications.id, application.id),
        with: {
          program: true,
          user: true,
        },
      });

    return NextResponse.json(applicationWithRelations, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET /api/programs/[id]/applications - 프로그램 신청 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    const whereClauses = [eq(programApplications.programId, programId)];

    if (status && ["submitted", "closed", "cancelled"].includes(status)) {
      whereClauses.push(
        eq(
          programApplications.status,
          status as "submitted" | "closed" | "cancelled"
        )
      );
    }

    const whereCondition =
      whereClauses.length > 0 ? and(...whereClauses) : undefined;

    // pagination 여부 확인
    const isPaginated = limit || page;

    if (isPaginated) {
      const limitNum = limit ? parseInt(limit) : 10;
      const pageNum = page ? parseInt(page) : 1;
      const offsetNum = offset ? parseInt(offset) : (pageNum - 1) * limitNum;

      const [data, [{ value: totalCount }]] = await Promise.all([
        db.query.programApplications.findMany({
          where: whereCondition,
          orderBy: [
            desc(programApplications.createdAt),
            desc(programApplications.id),
          ],
          limit: limitNum,
          offset: offsetNum,
          with: {
            program: true,
            user: true,
          },
        }),
        db
          .select({ value: count() })
          .from(programApplications)
          .where(whereCondition),
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

    // 기본: 전체 데이터 반환
    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.programApplications.findMany({
        where: whereCondition,
        orderBy: [
          desc(programApplications.createdAt),
          desc(programApplications.id),
        ],
        with: {
          program: true,
          user: true,
        },
      }),
      db
        .select({ value: count() })
        .from(programApplications)
        .where(whereCondition),
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
