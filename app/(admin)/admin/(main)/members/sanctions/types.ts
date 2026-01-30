export interface SanctionRecord {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  sanctionType: "블랙리스트" | "활동정지";
  category: string;
  reason: string;
  startDate: string | null;
  endDate: string | null;
  status: "active" | "released";
  createdAt: string;
  no: number;
}

export interface SanctionsResponse {
  sanctions: SanctionRecord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}
