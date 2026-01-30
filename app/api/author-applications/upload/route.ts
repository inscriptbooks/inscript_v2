import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadStorageFile } from "@/lib/supabase/storage";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 파일 타입/확장자 검증 (문서/이미지 허용, 일부 확장자 금지)
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/x-hwp",
      "application/x-hwpml",
    ];
    const allowedExts = [
      "pdf",
      "doc",
      "docx",
      "hwp",
      "hwpx",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
    ];
    const forbiddenExts = [
      "zip",
      "exe",
      "bat",
      "js",
      "apk",
      "xlsx",
      "csv",
    ];

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    if (forbiddenExts.includes(fileExt)) {
      return NextResponse.json(
        { error: "해당 파일 확장자는 업로드할 수 없습니다." },
        { status: 400 }
      );
    }

    const isTypeAllowed = file.type ? allowedTypes.includes(file.type) : false;
    const isExtAllowed = fileExt ? allowedExts.includes(fileExt) : false;
    if (!(isTypeAllowed || isExtAllowed)) {
      return NextResponse.json(
        {
          error: "지원하지 않는 파일 형식입니다. (PDF, 이미지, Word/HWP 파일만 가능)",
        },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "파일 크기는 10MB를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    // File을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 파일명 생성
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `author-verifications/${user.id}/${timestamp}.${fileExtension}`;

    // Storage에 업로드 (문서/이미지 혼합 허용 버킷 사용)
    const { url } = await uploadStorageFile("files", buffer, fileName);

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "파일 업로드 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
