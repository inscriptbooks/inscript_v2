import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { searchKeywords } from "@/lib/db/schema/searchKeywords";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { keyword } = body;

    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      return NextResponse.json(
        { error: "keyword is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const result = await db.insert(searchKeywords).values({
      keyword: keyword.trim(),
      userId: user.id,
    });

    return NextResponse.json(
      { message: "Search keyword saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save search keyword" },
      { status: 500 }
    );
  }
}
