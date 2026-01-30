import { NextRequest } from "next/server";
import { createImageUploadHandler } from "@/lib/supabase/storage";

/**
 * 배너 이미지 업로드
 * POST /api/banners/upload
 */
export async function POST(request: NextRequest) {
  return createImageUploadHandler("images", "banners", {
    maxSize: 10 * 1024 * 1024, // 10MB
    quality: 90,
  })(request);
}
