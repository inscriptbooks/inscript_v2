import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return "1분 전";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours}시간 전`;

  const days = differenceInDays(now, date);
  if (days < 7) return `${days}일 전`;

  const weeks = differenceInWeeks(now, date);
  if (weeks < 5) return `${weeks}주 전`;

  const months = differenceInMonths(now, date);
  if (months < 12) return `${months}달 전`;

  const years = differenceInYears(now, date);
  return `${years}년 전`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * 날짜-시간을 한국식 포맷으로 변환합니다 (yyyy.MM.dd HH:mm)
 * @param dateTime 날짜-시간 문자열 또는 Date 객체
 * @returns 포맷된 날짜-시간 문자열 (예: 2025.10.15 14:30)
 */
export function formatDateTime(dateTime: string | Date): string {
  return format(new Date(dateTime), "yyyy.MM.dd HH:mm");
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export function flattenArray<T>(array: T[][]): T[] {
  return array.flat();
}

/**
 * 한글 문자열의 첫 글자에서 초성을 추출합니다.
 * @param str 한글 문자열
 * @returns 초성 문자 (예: 'ㄱ', 'ㄴ', etc.)
 */
export function getInitialConsonant(str: string): string | null {
  if (!str) return null;

  const firstChar = str[0];
  const code = firstChar.charCodeAt(0);

  // 한글 유니코드 범위: 0xAC00(가) ~ 0xD7A3(힣)
  if (code >= 0xac00 && code <= 0xd7a3) {
    const consonants = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];
    const initialConsonantIndex = Math.floor((code - 0xac00) / 28 / 21);
    return consonants[initialConsonantIndex];
  }

  // 한글이 아닌 경우 null 반환
  return null;
}

/**
 * 영문 문자열의 첫 글자를 대문자로 추출합니다.
 * @param str 영문 문자열
 * @returns 첫 글자 대문자 (예: 'A', 'B', etc.) 또는 null
 */
export function getInitialLetter(str: string): string | null {
  if (!str) return null;

  const firstChar = str[0];

  // 영문자인지 확인
  if (/[A-Za-z]/.test(firstChar)) {
    return firstChar.toUpperCase();
  }

  return null;
}

/**
 * 데이터 배열을 초성별로 그룹화합니다.
 * @param items 데이터 배열
 * @param getTitleFn 제목을 추출하는 함수
 * @returns 초성별로 그룹화된 객체 { 'ㄱ': [...], 'ㄴ': [...], 'A': [...], ... }
 */
export function groupByConsonant<T>(
  items: T[],
  getTitleFn: (item: T) => string,
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const title = getTitleFn(item);
      
      // 한글 초성 체크
      const koreanConsonant = getInitialConsonant(title);
      if (koreanConsonant) {
        if (!acc[koreanConsonant]) {
          acc[koreanConsonant] = [];
        }
        acc[koreanConsonant].push(item);
        return acc;
      }

      // 영문 첫 글자 체크
      const englishLetter = getInitialLetter(title);
      if (englishLetter) {
        if (!acc[englishLetter]) {
          acc[englishLetter] = [];
        }
        acc[englishLetter].push(item);
      }

      return acc;
    },
    {} as Record<string, T[]>,
  );
}
