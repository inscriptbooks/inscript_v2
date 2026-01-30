import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { bookmarks } from "@/lib/db/schema/bookmarks";
import { and, eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const playId = searchParams.get("playId");
    const memoId = searchParams.get("memoId");
    const authorId = searchParams.get("authorId");
    const programId = searchParams.get("programId");
    const postId = searchParams.get("postId");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const whereClauses = [];

    if (userId) whereClauses.push(eq(bookmarks.userId, userId));
    if (playId) whereClauses.push(eq(bookmarks.playId, playId));
    if (memoId) whereClauses.push(eq(bookmarks.memoId, memoId));
    if (authorId) whereClauses.push(eq(bookmarks.authorId, authorId));
    if (programId) whereClauses.push(eq(bookmarks.programId, programId));
    if (postId) whereClauses.push(eq(bookmarks.postId, postId));

    const data = await db.query.bookmarks.findMany({
      where: whereClauses.length > 0 ? and(...whereClauses) : undefined,
      with: {
        user: true,
        play: {
          with: {
            author: {
              with: {
                user: true,
              },
            },
          },
        },
        memo: {
          with: {
            user: true,
            play: {
              with: {
                author: {
                  with: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        author: {
          with: {
            user: true,
          },
        },
        program: true,
        post: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(bookmarks.createdAt)],
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playId, memoId, authorId, programId, postId } = body;

    if (!playId && !memoId && !authorId && !programId && !postId) {
      return NextResponse.json(
        { error: "playId, memoId, authorId, programId, or postId is required" },
        { status: 400 }
      );
    }

    const providedCount = [playId, memoId, authorId, programId, postId].filter(
      Boolean
    ).length;
    if (providedCount > 1) {
      return NextResponse.json(
        {
          error:
            "Only one of playId, memoId, authorId, programId, or postId should be provided",
        },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 가져오기
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const type = playId
      ? "play"
      : memoId
        ? "memo"
        : programId
          ? "program"
          : postId
            ? "post"
            : "author";

    // 이미 북마크가 존재하는지 확인
    const whereConditions = [eq(bookmarks.userId, userId)];
    if (playId) whereConditions.push(eq(bookmarks.playId, playId));
    if (memoId) whereConditions.push(eq(bookmarks.memoId, memoId));
    if (authorId) whereConditions.push(eq(bookmarks.authorId, authorId));
    if (programId) whereConditions.push(eq(bookmarks.programId, programId));
    if (postId) whereConditions.push(eq(bookmarks.postId, postId));

    const existingBookmark = await db.query.bookmarks.findFirst({
      where: and(...whereConditions),
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark already exists" },
        { status: 409 }
      );
    }

    const id = uuidv4();
    await db.insert(bookmarks).values({
      id,
      type,
      userId,
      playId: playId || null,
      memoId: memoId || null,
      authorId: authorId || null,
      programId: programId || null,
      postId: postId || null,
    });

    // 카운트 업데이트는 트리거가 자동으로 처리

    const newBookmark = await db.query.bookmarks.findFirst({
      where: eq(bookmarks.id, id),
      with: {
        user: true,
        play: playId
          ? {
              with: {
                author: {
                  with: {
                    user: true,
                  },
                },
              },
            }
          : undefined,
        memo: memoId
          ? {
              with: {
                user: true,
                play: {
                  with: {
                    author: {
                      with: {
                        user: true,
                      },
                    },
                  },
                },
              },
            }
          : undefined,
        author: authorId
          ? {
              with: {
                user: true,
              },
            }
          : undefined,
        program: programId ? true : undefined,
        post: postId
          ? {
              with: {
                user: true,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json(newBookmark);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { playId, memoId, authorId, programId, postId } = body;

    if (!playId && !memoId && !authorId && !programId && !postId) {
      return NextResponse.json(
        { error: "playId, memoId, authorId, programId, or postId is required" },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 가져오기
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const whereConditions = [eq(bookmarks.userId, userId)];
    if (playId) whereConditions.push(eq(bookmarks.playId, playId));
    if (memoId) whereConditions.push(eq(bookmarks.memoId, memoId));
    if (authorId) whereConditions.push(eq(bookmarks.authorId, authorId));
    if (programId) whereConditions.push(eq(bookmarks.programId, programId));
    if (postId) whereConditions.push(eq(bookmarks.postId, postId));

    const existingBookmark = await db.query.bookmarks.findFirst({
      where: and(...whereConditions),
    });

    if (!existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    await db.delete(bookmarks).where(and(...whereConditions));

    // 카운트 업데이트는 트리거가 자동으로 처리

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
