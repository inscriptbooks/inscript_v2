import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema/authors";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await db.query.authors.findFirst({
    where: eq(authors.id, id),
    with: {
      user: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
