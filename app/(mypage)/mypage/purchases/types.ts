export interface PurchaseItem {
  id: string;
  playId: string;
  playTitle: string;
  author: string;
  purchaseDate: string;
  purchasedAt?: string; // ISO 날짜 문자열 (다운로드 기간 계산용)
  price: number;
  attachmentUrl?: string;
  isDownloaded?: boolean;
  orderId?: string;
}
