import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, degrees } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { playId, orderId } = body;

    if (!playId || !orderId) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    const { data: purchaseItem } = await supabase
      .from("payment_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("play_id", playId)
      .eq("order_id", orderId)
      .single();

    if (!purchaseItem) {
      return NextResponse.json(
        { error: "구매 내역을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const { data: playData } = await supabase
      .from("plays")
      .select("attachment_url, attachment_name, attachment_path, title")
      .eq("id", playId)
      .single();

    if (!playData || !playData.attachment_url) {
      return NextResponse.json(
        { error: "다운로드 파일을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const { data: existingDownload } = await supabase
      .from("play_downloads")
      .select("id")
      .eq("user_id", user.id)
      .eq("play_id", playId)
      .eq("order_id", orderId)
      .single();

    if (!existingDownload) {
      const { error: insertError } = await supabase
        .from("play_downloads")
        .insert({
          user_id: user.id,
          play_id: playId,
          order_id: orderId,
        });

      if (insertError) {
        return NextResponse.json(
          { error: "다운로드 이력 저장에 실패했습니다." },
          { status: 500 },
        );
      }
    }

    const watermarkText = user.email || user.id;

    let downloadPath = playData.attachment_path || playData.attachment_name;

    if (!downloadPath && playData.attachment_url) {
      const patterns = [
        "/storage/v1/object/public/files/",
        "/storage/v1/object/files/",
        "/object/public/files/",
      ];

      for (const pattern of patterns) {
        if (playData.attachment_url.includes(pattern)) {
          const urlParts = playData.attachment_url.split(pattern);
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
        { status: 400 },
      );
    }

    const lowerPath = downloadPath.toLowerCase();
    if (!lowerPath.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "PDF 파일만 다운로드할 수 있습니다." },
        { status: 400 },
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("files")
      .download(downloadPath);

    if (downloadError || !fileData) {
      return NextResponse.json(
        {
          error: "파일을 가져오는데 실패했습니다.",
          details: downloadError?.message,
        },
        { status: 500 },
      );
    }

    const pdfBuffer = await fileData.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBuffer);

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
      if (
        typeof playData.attachment_name === "string" &&
        playData.attachment_name.length > 0
      ) {
        return playData.attachment_name.replace(/\.[^/.]+$/, "");
      }

      if (typeof downloadPath === "string" && downloadPath.length > 0) {
        const lastSegment = downloadPath.split("/").pop();
        if (lastSegment) {
          return lastSegment.replace(/\.[^/.]+$/, "");
        }
      }

      return playData.title || "download";
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
    return NextResponse.json(
      { error: "다운로드 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
