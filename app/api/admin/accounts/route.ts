import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { AdminAccountRegisterFormSchema } from "@/components/forms/schema";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchCategory = searchParams.get("searchCategory");
    const searchQuery = searchParams.get("searchQuery");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const supabase = await createClient();

    // 기본 쿼리 시작 - role이 admin인 것만 조회
    let query = supabase
      .from("users")
      .select(
        "id, name, email, role, auth_provider, status, admin_kind, created_at, last_login, phone, admin_memo",
        { count: "exact" }
      )
      .eq("role", "admin");

    // 검색 필터
    if (searchQuery && searchCategory) {
      if (searchCategory === "이름") {
        query = query.ilike("name", `%${searchQuery}%`);
      } else if (searchCategory === "ID" || searchCategory === "이메일") {
        query = query.ilike("email", `%${searchQuery}%`);
      }
    }

    // 상태 필터 (status 기준)
    if (status && status !== "전체") {
      // Y = active, N = suspended
      const statusValue = status === "Y" ? "active" : "suspended";
      query = query.eq("status", statusValue);
    }

    // 타입 필터 (admin_kind 기준)
    if (type && type !== "전체") {
      const kindMap: Record<string, string> = {
        최고관리자: "master",
        운영관리자: "second",
      };
      const kindValue = kindMap[type];
      if (kindValue) {
        query = query.eq("admin_kind", kindValue);
      }
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 정렬 처리 (status는 후처리, 나머지는 DB에서 직접 정렬)
    const ascending = sortOrder === "asc";
    if (sortBy === "status") {
      query = query.range(from, to).order("created_at", { ascending: false });
    } else {
      query = query.range(from, to).order("created_at", { ascending });
    }

    const { data: accounts, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 상태(status) 정렬은 후처리로 수행
    let sortedAccounts = accounts || [];
    if (sortBy === "status") {
      const statusOrder: Record<string, number> = { active: 0, suspended: 1 };
      sortedAccounts = [...sortedAccounts].sort((a, b) => {
        const orderA = statusOrder[a.status || ""] ?? 2;
        const orderB = statusOrder[b.status || ""] ?? 2;
        return ascending ? orderA - orderB : orderB - orderA;
      });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      accounts: sortedAccounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "관리자 계정 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();

    // 스키마 검증
    const validatedData = AdminAccountRegisterFormSchema.parse(body);

    // 이메일 중복 체크
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", validatedData.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "이미 존재하는 이메일입니다." },
        { status: 400 }
      );
    }

    // Supabase Auth에 사용자 생성
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: validatedData.email,
        password: validatedData.password,
        email_confirm: true,
        user_metadata: {
          name: validatedData.name,
        },
      });

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 500 }
      );
    }

    // users 테이블에 관리자 정보 저장
    const { error: insertError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: validatedData.email,
      name: validatedData.name,
      role: "admin",
      admin_kind: "second",
      status: "active",
      auth_provider: "local",
    });

    if (insertError) {
      // users 테이블 삽입 실패 시 Auth 사용자 삭제
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "관리자 계정이 성공적으로 등록되었습니다.",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "입력 데이터가 올바르지 않습니다." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "관리자 계정 등록에 실패했습니다." },
      { status: 500 }
    );
  }
}
