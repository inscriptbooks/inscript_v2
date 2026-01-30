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
        { error: "filename, filePath, or attachmentUrl is required" },
        { status: 400 }
      );
    }

    const watermarkText = email || user.email || user.id;

    let downloadPath = filePath || filename;

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
        { error: "파일 경로를 결정할 수 없습니다." },
        { status: 400 }
      );
    }

    const lowerPath = downloadPath.toLowerCase();
    if (!lowerPath.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "PDF 파일만 다운로드할 수 있습니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.storage
      .from("files")
      .download(downloadPath);

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to fetch PDF from storage" },
        { status: 500 }
      );
    }

    const pdfBuffer = await data.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // 워터마크 추가 (전체 페이지)
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = 70;
      const textWidth = watermarkText.length * fontSize * 0.35;
      const textHeight = fontSize;

      page.drawText(watermarkText, {
        x: width / 2 - textWidth / 2,
        y: height / 4 + textHeight / 4,
        size: fontSize,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.3,
        rotate: degrees(45),
      });
    }

    const watermarkedPdfBytes = await pdfDoc.save();

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

      return "download";
    })();

    const responseFilename = `${baseFilename}_${watermarkText}.pdf`;
    const encodedFilename = encodeURIComponent(responseFilename);

    const pdfArrayBuffer = watermarkedPdfBytes.slice().buffer;

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
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
