export interface WriterData {
  id: string;
  writerId: string;
  name: string;
  email: string;
  representative: string;
  keywords: string[];
  status: string;
  registeredAt: string;
  worksCount: number;
  memosCount: number;
  scrapsCount: number;
}

export interface WritersResponse {
  writers: WriterData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  stats: {
    visibleCount: number;
    hiddenCount: number;
  };
}
