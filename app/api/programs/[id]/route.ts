import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programs } from "@/lib/db/schema/programs";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { uploadStorageFile } from "@/lib/supabase/storage";
import sharp from "sharp";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await db.query.programs.findFirst({
      where: eq(programs.id, id),
    });

    if (!data) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const { id } = await params;
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const eventDateTime = formData.get("eventDateTime") as string;
    const applicationStartDate = formData.get("applicationStartDate") as string;
    const applicationEndDate = formData.get("applicationEndDate") as string;
    const location = formData.get("location") as string;
    const capacity = formData.get("capacity") as string;
    const notes = formData.get("notes") as string;
    const keywords = formData.get("keywords") as string;
    const description = formData.get("description") as string;
    const smartstoreUrl = formData.get("smartstoreUrl") as string;
    const isVisible = formData.get("isVisible") as string;
    const image = formData.get("image") as File | null;

    if (
      !title ||
      !eventDateTime ||
      !applicationStartDate ||
      !applicationEndDate ||
      !smartstoreUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let thumbnailUrl: string | undefined;

    // 새 이미지가 업로드된 경우에만 처리
    if (image && image.size > 0) {
      // 파일 크기 제한 (10MB)
      if (image.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "파일 크기는 10MB를 초과할 수 없습니다." },
          { status: 400 }
        );
      }
      const arrayBuffer = await image.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      let webpBuffer: Buffer;
      let finalFileName = "";
      const timestamp = Date.now();
      const originalName = image.name.replace(/\.[^.]+$/, "");

      try {
        webpBuffer = await sharp(inputBuffer).webp({ quality: 90 }).toBuffer();
        finalFileName = `programs/${timestamp}-${originalName}.webp`;
      } catch (sharpError) {
        webpBuffer = inputBuffer;
        finalFileName = `programs/${timestamp}-${image.name}`;
      }

      const { url } = await uploadStorageFile(
        "images",
        webpBuffer,
        finalFileName
      );
      thumbnailUrl = url;
    }

    const keywordArray = keywords
      ? keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    const eventDate = new Date(eventDateTime);
    const appStartDate = new Date(applicationStartDate);
    const appEndDate = new Date(applicationEndDate);

    if (
      isNaN(eventDate.getTime()) ||
      isNaN(appStartDate.getTime()) ||
      isNaN(appEndDate.getTime())
    ) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const updateData: any = {
      title,
      eventDateTime: eventDate,
      applicationStartAt: appStartDate,
      applicationEndAt: appEndDate,
      location: location || null,
      capacity:
        capacity && !isNaN(parseInt(capacity)) ? parseInt(capacity) : null,
      notes: notes || null,
      keyword: keywordArray,
      description: description || null,
      smartstoreUrl,
      isVisible: isVisible === "true",
    };

    // 새 이미지가 있는 경우에만 thumbnailUrl 업데이트
    if (thumbnailUrl) {
      updateData.thumbnailUrl = thumbnailUrl;
    }

    const [updatedProgram] = await db
      .update(programs)
      .set(updateData)
      .where(eq(programs.id, id))
      .returning();

    if (!updatedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProgram);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
