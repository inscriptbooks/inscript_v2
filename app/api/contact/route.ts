import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await request.formData();

    // 폼 데이터 추출
    const category = formData.get("category") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const consent = formData.get("consent") === "true";
    const file = formData.get("file") as File | null;

    // 필수 필드 검증
    if (
      !category ||
      !email ||
      !name ||
      !phone ||
      !subject ||
      !message ||
      !consent
    ) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    let attachments: string[] = [];

    // 파일 크기 제한 (10MB)
    if (file && file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 10MB를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    // 파일이 있으면 Supabase Storage에 업로드
    if (file && file.size > 0) {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `contact/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("email")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: "파일 업로드에 실패했습니다." },
          { status: 500 }
        );
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from("email")
        .getPublicUrl(filePath);

      attachments.push(urlData.publicUrl);
    }

    // Edge Function 호출을 위한 데이터 준비
    const emailData = {
      category,
      email,
      name,
      phone,
      subject,
      message,
      consent,
      attachments,
    };

    // Supabase Edge Function 호출
    const { data: functionData, error: functionError } =
      await supabase.functions.invoke("send-contact-email", {
        body: emailData,
      });

    if (functionError) {
      return NextResponse.json(
        { error: "이메일 발송에 실패했습니다." },
        { status: 500 }
      );
    }

    // Edge Function 응답 확인
    if (functionData?.ok === true) {
      return NextResponse.json(
        { success: true, message: "문의가 성공적으로 전송되었습니다." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "이메일 발송에 실패했습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
