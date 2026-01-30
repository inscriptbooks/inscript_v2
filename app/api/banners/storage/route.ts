import { NextRequest } from "next/server";
import { createImageDeleteHandler } from "@/lib/supabase/storage";

/**
 * 배너 이미지 삭제
 * DELETE /api/banners/storage?url={url} 또는 ?path={path}
 */
export async function DELETE(request: NextRequest) {
  return createImageDeleteHandler("images")(request);
}
