import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { filename, email, filePath, attachmentUrl } = await request.json();

    if (!filename && !filePath && !attachmentUrl) {
      return NextResponse.json(
        { error: "파일 정보가 부족합니다." },
        { status: 400 }
      );
    }

    const watermarkText = email || user.email || user.id;

    // 다운로드할 경로 결정
    let downloadPath = filePath;

    // filePath가 없고 attachmentUrl이 있으면 URL에서 경로 추출
    if (!downloadPath && attachmentUrl) {
      const patterns = [
        "/storage/v1/object/public/files/",
        "/storage/v1/object/files/",
        "/object/public/files/",
      ];

      for (const pattern of patterns) {
        if (attachmentUrl.includes(pattern)) {
          const urlParts = attachmentUrl.split(pattern);
          if (urlParts.length > 1) {
            downloadPath = decodeURIComponent(urlParts[1]);
            break;
          }
        }
      }
    }

    if (!downloadPath) {
      return NextResponse.json(
        { error: "파일 경로를 확인할 수 없습니다." },
        { status: 400 }
      );
    }

    // PDF 파일인지 확장자로 1차 검증
    const lowerPath = downloadPath.toLowerCase();
    if (!lowerPath.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "PDF 파일만 미리보기할 수 있습니다." },
        { status: 400 }
      );
    }

    // Supabase 스토리지에서 PDF 파일 다운로드
    const { data, error: storageError } = await supabase.storage
      .from("files")
      .download(downloadPath);

    if (storageError || !data) {
      return NextResponse.json(
        { error: "파일을 불러오지 못했습니다. (Storage Error)" },
        { status: 500 }
      );
    }

    const pdfBuffer = await data.arrayBuffer();

    // PDF 로드
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    // 1-3페이지만 추출 (최대 3페이지)
    const pagesToKeep = Math.min(3, totalPages);
    const newPdfDoc = await PDFDocument.create();

    for (let i = 0; i < pagesToKeep; i++) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);
    }

    // 워터마크 추가
    const pages = newPdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = 70; // 폰트 크기를 훨씬 크게 조정
      const textWidth = watermarkText.length * fontSize * 0.35; // 텍스트 너비 계산 조정
      const textHeight = fontSize; // 텍스트 높이

      // 워터마크 텍스트 추가 (문자열 중심이 페이지 정 가운데, 45도 회전)
      page.drawText(watermarkText, {
        x: width / 2 - textWidth / 2, // 페이지 중앙에 오도록 x 좌표 조정
        y: height / 4 + textHeight / 4, // 페이지 중앙보다 약간 아래로 조정
        size: fontSize,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.3,
        rotate: degrees(45),
      });
    }

    const watermarkedPdfBytes = await newPdfDoc.save();

    // 응답용 파일명 생성 (filename이 없을 수 있는 경우 대비)
    const baseFilename = (() => {
      if (typeof filename === "string" && filename.length > 0) {
        return filename.replace(/\.[^/.]+$/, "");
      }

      if (typeof downloadPath === "string" && downloadPath.length > 0) {
        const lastSegment = downloadPath.split("/").pop();
        if (lastSegment) {
          return lastSegment.replace(/\.[^/.]+$/, "");
        }
      }

      return "preview";
    })();

    const responseFilename = `${baseFilename}_preview_${watermarkText}.pdf`;
    const encodedFilename = encodeURIComponent(responseFilename);

    // Uint8Array -> ArrayBuffer 변환 (BodyInit 호환 타입)
    const pdfArrayBuffer = watermarkedPdfBytes.slice().buffer;

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        // filename* 에만 UTF-8 인코딩 값을 넣고, 한글이 포함된 생 파일명은 헤더에서 제거
        "Content-Disposition": `inline; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
