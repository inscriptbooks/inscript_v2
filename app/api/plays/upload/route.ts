import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadStorageFile } from "@/lib/supabase/storage";

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
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "파일 크기는 10MB를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    // 파일명 구성: plays/{userId}/{timestamp}-{originalName}
    const timestamp = Date.now();
    const originalName = file.name;
    const sanitized = originalName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const fileName = `plays/${user.id}/${timestamp}-${sanitized}`;

    const { url, path } = await uploadStorageFile("files", file, fileName);

    return NextResponse.json(
      { url, path, name: originalName, attachmentPath: path },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "파일 업로드 중 오류가 발생했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
