export enum BannerType {
  MAIN = "main",
  AD = "ad",
}

export const BannerTypeLabel: Record<BannerType, string> = {
  [BannerType.MAIN]: "메인 배너",
  [BannerType.AD]: "광고 배너",
};

export interface Banner {
  id: string;
  title: string;
  type: BannerType;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
