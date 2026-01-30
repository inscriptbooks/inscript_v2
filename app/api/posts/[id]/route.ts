import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema/posts";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import * as cheerio from "cheerio";
import { uploadStorageFile } from "@/lib/supabase/storage";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      user: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

type UploadResult =
  | { ok: true; url: string; path: string }
  | { ok: false; message: string };

async function uploadBase64Image(base64Data: string): Promise<UploadResult> {
  const match = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    return { ok: false, message: "Invalid base64 image data" };
  }

  const [, mimeType, base64String] = match;
  const inputBuffer = Buffer.from(base64String, "base64");

  // 파일 크기 제한 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (inputBuffer.length > maxSize) {
    return {
      ok: false,
      message: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
    };
  }

  // 지원되는 이미지 타입 확인
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!allowedTypes.includes(mimeType)) {
    return {
      ok: false,
      message: "Invalid file type. Only images are allowed.",
    };
  }

  // Sharp를 사용해 WebP로 변환
  const webpBuffer = await sharp(inputBuffer).webp({ quality: 90 }).toBuffer();

  // 파일명 생성
  const timestamp = Date.now();
  const originalName = uuidv4();
  const fileName = `posts/${timestamp}-${originalName}.webp`;

  const uploaded = await uploadStorageFile("images", webpBuffer, fileName);
  return { ok: true, url: uploaded.url, path: uploaded.path };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, category, title, content, isVisible } = body;

    if (!type || !category || !title || !content) {
      return NextResponse.json(
        { error: "type, category, title, and content are required" },
        { status: 400 }
      );
    }

    // 타입 유효성 검증
    const validTypes = [
      "recruit",
      "market",
      "qna",
      "promotion",
      "news",
      "author",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error:
            "Invalid type. Must be one of: recruit, market, qna, promotion, news, author",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 기존 게시글 확인
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.id, id),
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 이미지 처리
    const $ = cheerio.load(content);
    const imgElements = $("img");
    let thumbnailUrl: string | null = existingPost.thumbnailUrl;

    const uploadPromises: Promise<void>[] = [];

    imgElements.each((_index, element) => {
      const src = $(element).attr("src");
      if (src && src.startsWith("data:image/")) {
        const uploadPromise = (async () => {
          const result = await uploadBase64Image(src);
          if (result.ok) {
            $(element).attr("src", result.url);
            if (!thumbnailUrl) {
              thumbnailUrl = result.url;
            }
          } else {
            $(element).remove();
          }
        })();
        uploadPromises.push(uploadPromise);
      }
    });

    await Promise.all(uploadPromises);

    // TipTap의 ResizableImageExtension 래퍼 처리
    $("img").each((_i, el) => {
      const img = $(el);
      const wrapperStyle = img.attr("wrapperstyle");
      const containerStyle = img.attr("containerstyle");
      if (wrapperStyle || containerStyle) {
        const combinedStyle = [wrapperStyle, containerStyle]
          .filter(Boolean)
          .join(" ");
        const wrapper = $("<div></div>").attr("style", combinedStyle);
        img.removeAttr("wrapperstyle");
        img.removeAttr("containerstyle");
        img.wrap(wrapper);
      }
    });

    const updatedContent = $.html();

    const updateData: any = {
      type,
      category,
      title,
      content: updatedContent,
      thumbnailUrl: thumbnailUrl,
    };

    if (typeof isVisible === "boolean") {
      updateData.isVisible = isVisible;
    }

    await db.update(posts).set(updateData).where(eq(posts.id, id));

    const updatedPost = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        user: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 게시글 존재 확인
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.id, id),
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // is_deleted를 true로 업데이트 (soft delete)
    await db.update(posts).set({ isDeleted: true }).where(eq(posts.id, id));

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
