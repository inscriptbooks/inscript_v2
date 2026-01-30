import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookmarks } from "@/lib/db/schema/bookmarks";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await db.query.bookmarks.findFirst({
      where: eq(bookmarks.id, id),
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
    });

    if (!data) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
