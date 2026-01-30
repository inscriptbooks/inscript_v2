export interface ApplicationData {
  id: string;
  program_id: string;
  program_title: string;
  program_thumbnail_url?: string;
  program_event_date_time?: string;
  program_location?: string;
  program_capacity?: number;
  program_description?: string;
  user_id: string;
  user_email: string;
  name: string;
  email: string;
  phone: string;
  status: "completed" | "cancelled" | "ended";
  created_at: string;
  user_nickname?: string;
}

export interface ApplicationsResponse {
  applications: ApplicationData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  statistics: {
    completedCount: number;
    cancelledCount: number;
    endedCount: number;
  };
}
