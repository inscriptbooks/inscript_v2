export interface ProgramData {
  id: string;
  title: string;
  event_date: string;
  event_location: string;
  application_start_date: string;
  application_end_date: string;
  status: string;
  is_visible: boolean;
  created_at: string;
  memos_count: number;
  bookmarks_count: number;
}

export interface ProgramsResponse {
  programs: ProgramData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  statistics: {
    progressCount: number;
    endedCount: number;
  };
}
