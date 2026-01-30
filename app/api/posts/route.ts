import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema/posts";
import { eq, ilike, desc, count, and, or, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import * as cheerio from "cheerio";
import { uploadStorageFile } from "@/lib/supabase/storage";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const createdById = searchParams.get("createdById");
    const type = searchParams.get("type");
    const keyword = searchParams.get("keyword");
    const filterType = searchParams.get("filterType"); // 'title', 'author', 'titleContent'
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");
    const sortBy = searchParams.get("sortBy"); // 'viewCount' or 'createdAt' (default)

    const whereClauses = [];
    // 기본 필터: 공개된 게시글만, 삭제되지 않은 게시글만
    whereClauses.push(eq(posts.isVisible, true));
    whereClauses.push(eq(posts.isDeleted, false));
    if (createdById) whereClauses.push(eq(posts.userId, createdById));
    const validTypes = [
      "recruit",
      "market",
      "qna",
      "promotion",
      "news",
      "author",
    ] as const;
    if (type && (validTypes as readonly string[]).includes(type)) {
      whereClauses.push(eq(posts.type, type as (typeof validTypes)[number]));
    }
    if (keyword) {
      // filterType에 따라 검색 조건 분기
      if (filterType === "title") {
        // 제목만 검색
        whereClauses.push(ilike(posts.title, `%${keyword}%`));
      } else if (filterType === "author") {
        // 글 작성자만 검색
        whereClauses.push(
          sql`EXISTS (
            SELECT 1 FROM users
            WHERE users.id = ${posts.userId}
            AND users.name ILIKE ${`%${keyword}%`}
          )`
        );
      } else if (filterType === "titleContent") {
        // 제목 + 내용 검색
        whereClauses.push(
          or(
            ilike(posts.title, `%${keyword}%`),
            ilike(posts.content, `%${keyword}%`)
          )
        );
      } else {
        // filterType이 없거나 잘못된 경우 기본 동작 (제목 + 작성자)
        whereClauses.push(
          or(
            ilike(posts.title, `%${keyword}%`),
            sql`EXISTS (
              SELECT 1 FROM users
              WHERE users.id = ${posts.userId}
              AND users.name ILIKE ${`%${keyword}%`}
            )`
          )
        );
      }
    }

    const whereCondition =
      whereClauses.length > 0 ? and(...whereClauses) : undefined;

    // 정렬 기준 설정
    const orderByClause =
      sortBy === "viewCount"
        ? [desc(posts.viewCount), desc(posts.id)]
        : [desc(posts.createdAt), desc(posts.id)];

    // pagination 여부 확인
    const isPaginated = limit || page;

    if (isPaginated) {
      // page 기반 pagination 처리
      const limitNum = limit ? parseInt(limit) : 10;
      const pageNum = page ? parseInt(page) : 1;
      const offsetNum = offset ? parseInt(offset) : (pageNum - 1) * limitNum;

      const [data, [{ value: totalCount }]] = await Promise.all([
        db.query.posts.findMany({
          where: whereCondition,
          with: {
            user: true,
          },
          orderBy: orderByClause,
          limit: limitNum,
          offset: offsetNum,
        }),
        db.select({ value: count() }).from(posts).where(whereCondition),
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

    // 기본: 전체 데이터 + totalCount 반환
    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.posts.findMany({
        where: whereCondition,
        with: {
          user: true,
        },
        orderBy: orderByClause,
      }),
      db.select({ value: count() }).from(posts).where(whereCondition),
    ]);

    return NextResponse.json({
      data,
      meta: {
        totalCount,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
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

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    let type: string;
    let category: string;
    let title: string;
    let content: string;
    let file: File | null = null;

    // FormData 또는 JSON 처리
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      type = formData.get("type") as string;
      category = formData.get("category") as string;
      title = formData.get("title") as string;
      content = formData.get("content") as string;
      file = formData.get("file") as File | null;
    } else {
      const body = await request.json();
      type = body.type;
      category = body.category;
      title = body.title;
      content = body.content;
    }

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

    // 작가 커뮤니티 권한 체크
    if (type === "author") {
      const { data: dbUser } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!dbUser || (dbUser.role !== "author" && dbUser.role !== "admin")) {
        return NextResponse.json(
          { error: "작가 커뮤니티는 작가 회원만 작성할 수 있습니다." },
          { status: 403 }
        );
      }
    }

    const $ = cheerio.load(content);
    const imgElements = $("img");
    let thumbnailUrl: string | null = null;

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

    // TipTap의 ResizableImageExtension이 에디터 런타임에서만 유지하는 래퍼를
    // 저장 시 실제 div 래퍼로 변환해 정렬/크기를 보존
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
    const id = uuidv4();

    // 파일 첨부 처리
    let attachmentUrl: string | null = null;
    let attachmentName: string | null = null;

    if (file && file.size > 0) {
      // 파일 크기 제한 (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "파일 크기는 10MB 이하여야 합니다." },
          { status: 400 }
        );
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `posts/attachments/${timestamp}-${sanitizedFileName}`;

      const uploaded = await uploadStorageFile("files", fileBuffer, fileName);
      attachmentUrl = uploaded.url;
      attachmentName = file.name;
    }

    const newPostData = {
      id,
      type,
      category,
      title,
      content: updatedContent,
      thumbnailUrl: thumbnailUrl,
      attachmentUrl: attachmentUrl,
      attachmentName: attachmentName,
      userId: user.id,
    };

    await db.insert(posts).values(newPostData);

    const newPost = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        user: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
