import { createClient } from "./server";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Storage bucket 타입 정의
export type StorageBucket = "images" | "files" | "email";

// 기본 캐시 설정 (1년)
const CACHE_MAX_AGE = 31536000; // 365일 * 24시간 * 60분 * 60초

/**
 * Supabase Storage에 파일을 업로드합니다. (서버 사이드 전용)
 * @param bucket - 업로드할 버킷 이름
 * @param file - 업로드할 파일 (File 또는 Buffer)
 * @param fileName - 저장할 파일명
 * @param options - 업로드 옵션
 * @returns 업로드된 파일의 public URL과 경로
 */
export async function uploadStorageFile(
  bucket: StorageBucket,
  file: File | Buffer,
  fileName: string,
  options?: {
    cacheControl?: string;
    upsert?: boolean;
    contentType?: string;
  }
): Promise<{ url: string; path: string }> {
  const supabase = await createClient();

  const filePath = fileName;

  // 파일 확장자에 따른 contentType 자동 설정
  const getContentType = (path: string): string | undefined => {
    const ext = path.toLowerCase().split(".").pop();
    const contentTypeMap: Record<string, string> = {
      webp: "image/webp",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      hwp: "application/x-hwp",
      hwpx: "application/x-hwpml",
    };
    return ext ? contentTypeMap[ext] : undefined;
  };

  // contentType 결정: 옵션으로 전달된 값 > 자동 감지 > undefined
  const contentType = options?.contentType || getContentType(filePath);

  const body: File | ArrayBuffer = Buffer.isBuffer(file)
    ? new Uint8Array(file).buffer
    : file;

  // 파일 업로드 (cacheControl은 초 단위 문자열 권장)
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, body, {
      cacheControl: options?.cacheControl || String(CACHE_MAX_AGE),
      upsert: true,
      contentType,
    });

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }

  // Public URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}

/**
 * Supabase Storage에서 파일을 삭제합니다. (서버 사이드 전용)
 * @param bucket - 버킷 이름
 * @param filePath - 삭제할 파일 경로
 */
export async function deleteStorageFile(
  bucket: StorageBucket,
  filePath: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Storage URL에서 파일 경로를 추출합니다.
 * @param bucket - 버킷 이름
 * @param url - Supabase Storage의 public URL
 * @returns 파일 경로
 */
export function extractFilePathFromUrl(
  bucket: StorageBucket,
  url: string
): string {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split(
    `/storage/v1/object/public/${bucket}/`
  );
  return pathParts[1] || "";
}

/**
 * Storage 파일의 public URL을 가져옵니다. (서버 사이드 전용)
 * @param bucket - 버킷 이름
 * @param filePath - 파일 경로
 * @returns public URL
 */
export async function getStorageFileUrl(
  bucket: StorageBucket,
  filePath: string
): Promise<string> {
  const supabase = await createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return publicUrl;
}

// ========================================
// API Route 핸들러
// ========================================

/**
 * 이미지 업로드 API 핸들러를 생성합니다.
 * @param bucket - Storage 버킷 이름
 * @param folderPath - 버킷 내 폴더 경로 (예: 'banners', 'programs', 'posts')
 * @param options - 업로드 옵션
 * @returns NextResponse
 *
 * @example
 * // app/api/banners/upload/route.ts
 * export async function POST(request: NextRequest) {
 *   return createImageUploadHandler('images', 'banners')(request);
 * }
 */
export function createImageUploadHandler(
  bucket: StorageBucket,
  folderPath: string,
  options?: {
    maxSize?: number; // bytes (기본: 10MB)
    quality?: number; // 1-100 (기본: 90)
    allowedTypes?: string[];
  }
)
 {
  return async (request: NextRequest) => {
    try {
      console.log("Starting image upload handler");
      const formData = await request.formData();
      console.log("FormData parsed");
      const file = formData.get("file") as File;
      console.log("File extracted", file?.name, file?.type, file?.size);

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      // 파일 타입 확인
      const allowedTypes = options?.allowedTypes || [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only images are allowed." },
          { status: 400 }
        );
      }

      // 파일 크기 제한
      const maxSize = options?.maxSize || 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` },
          { status: 400 }
        );
      }

      // File을 Buffer로 변환
      const arrayBuffer = await file.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      // 파일명/버퍼 생성 (GIF는 애니메이션 유지, 실패 시 원본 GIF 업로드)
      const timestamp = Date.now();
      // Supabase Storage 'Invalid key' 에러 방지를 위해 (한글/특수문자 이슈) 파일명을 영숫자로만 구성
      const safeName = Math.random().toString(36).substring(2, 15);
      const quality = options?.quality || 90;

      let uploadBuffer: Buffer = inputBuffer;
      let fileName = `${folderPath}/${timestamp}-${safeName}.webp`;

      if (file.type === "image/gif") {
        try {
          // 애니메이티드 WebP 변환 (입력에 animated 옵션)
          uploadBuffer = await sharp(inputBuffer, { animated: true })
            .webp({ quality })
            .toBuffer();
          fileName = `${folderPath}/${timestamp}-${safeName}.webp`;
        } catch (_) {
          // 변환 실패 시 원본 GIF 업로드로 폴백
          uploadBuffer = inputBuffer;
          fileName = `${folderPath}/${timestamp}-${safeName}.gif`;
        }
      } else {
        // 기타 포맷은 기존과 동일하게 WebP로 변환
        uploadBuffer = await sharp(inputBuffer).webp({ quality }).toBuffer();
        fileName = `${folderPath}/${timestamp}-${safeName}.webp`;
      }

      // Storage에 업로드
      const { url, path } = await uploadStorageFile(
        bucket,
        uploadBuffer,
        fileName
      );

      return NextResponse.json({ url, path }, { status: 201 });
    } catch (error) {
      console.error("Image upload error:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Internal Server Error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * 이미지 삭제 API 핸들러를 생성합니다.
 * @param bucket - Storage 버킷 이름
 * @returns NextResponse
 *
 * @example
 * // app/api/banners/storage/route.ts
 * export async function DELETE(request: NextRequest) {
 *   return createImageDeleteHandler('images')(request);
 * }
 */
export function createImageDeleteHandler(bucket: StorageBucket) {
  return async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const url = searchParams.get("url");
      const path = searchParams.get("path");

      if (!url && !path) {
        return NextResponse.json(
          { error: "Either url or path parameter is required" },
          { status: 400 }
        );
      }

      // URL에서 파일 경로 추출 또는 직접 경로 사용
      const filePath = path || extractFilePathFromUrl(bucket, url!);

      if (!filePath) {
        return NextResponse.json(
          { error: "Invalid url or path provided" },
          { status: 400 }
        );
      }

      // Storage에서 삭제
      await deleteStorageFile(bucket, filePath);

      return NextResponse.json({ message: "File deleted successfully" });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Internal Server Error",
        },
        { status: 500 }
      );
    }
  };
}
