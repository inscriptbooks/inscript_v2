export interface AdminAccount {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  auth_provider: string | null;
  status: string | null;
  admin_kind: string | null;
  created_at: string;
  last_login: string | null;
  phone: string | null;
  admin_memo: string | null;
}

export interface AdminAccountFilter {
  searchCategory: string;
  searchQuery: string;
  status: string;
  type: string;
}

export interface AdminAccountsResponse {
  accounts: AdminAccount[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}
