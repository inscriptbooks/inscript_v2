export interface ApiResponse<T> {
  data: T;
  meta: {
    totalCount: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
}
