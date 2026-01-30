import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema/likes";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await db.query.likes.findFirst({
      where: eq(likes.id, id),
      with: {
        user: true,
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
            author: true,
            program: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
