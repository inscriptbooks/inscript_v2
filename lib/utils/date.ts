const KST_OFFSET = 9 * 60 * 60 * 1000; // 9시간 (밀리초)

/**
 * UTC 날짜를 한국 시간(KST, UTC+9)으로 변환하여 포맷팅
 * Supabase DB는 UTC로 저장됨
 */
export function formatKoreanDateTime(
  dateString: string | null | undefined
): string {
  if (!dateString) return "-";

  // 이미 타임존 정보가 있는지 확인 (Z, +00, +09 등)
  const hasTimezone = /[Zz]$|[+-]\d{2}(:\d{2})?$/.test(dateString);
  const utc = new Date(hasTimezone ? dateString : dateString + "Z");
  if (isNaN(utc.getTime())) return "-";

  const kst = new Date(utc.getTime() + KST_OFFSET);

  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");
  const hours = String(kst.getUTCHours()).padStart(2, "0");
  const minutes = String(kst.getUTCMinutes()).padStart(2, "0");
  const seconds = String(kst.getUTCSeconds()).padStart(2, "0");

  return `${year}. ${month}. ${day}. ${hours}:${minutes}:${seconds}`;
}

/**
 * UTC 날짜를 한국 시간(KST)으로 변환하여 날짜만 포맷팅
 */
export function formatKoreanDate(
  dateString: string | null | undefined
): string {
  if (!dateString) return "-";

  // 이미 타임존 정보가 있는지 확인 (Z, +00, +09 등)
  const hasTimezone = /[Zz]$|[+-]\d{2}(:\d{2})?$/.test(dateString);
  const utc = new Date(hasTimezone ? dateString : dateString + "Z");
  if (isNaN(utc.getTime())) return "-";

  const kst = new Date(utc.getTime() + KST_OFFSET);

  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");

  return `${year}. ${month}. ${day}.`;
}
