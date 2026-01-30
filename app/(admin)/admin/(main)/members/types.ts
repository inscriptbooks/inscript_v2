export interface Member {
  id: string;
  no: number;
  name: string;
  email: string;
  signupMethod: string;
  isWriter: boolean;
  status: "normal" | "suspended" | "blacklist";
  lastLogin: string;
  joinDate: string;
  adminMemo: string | null;
}

export interface MembersResponse {
  members: Member[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface FilterParams {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  isWriter?: string;
  status?: string;
  searchCategory?: string;
  searchQuery?: string;
}
