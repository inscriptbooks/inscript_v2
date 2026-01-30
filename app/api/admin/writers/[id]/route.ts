import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, message: "작가를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();

  const { koreanName, englishName, keywords, introduction, visibility } = body;

  const { error } = await supabase
    .from("authors")
    .update({
      author_name: koreanName,
      author_name_en: englishName,
      keyword: keywords,
      description: introduction,
      is_visible: visibility === "노출",
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, message: "작가 수정에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "작가 정보가 수정되었습니다.",
  });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase
    .from("authors")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, message: "작가 삭제에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "작가가 삭제되었습니다.",
  });
}
