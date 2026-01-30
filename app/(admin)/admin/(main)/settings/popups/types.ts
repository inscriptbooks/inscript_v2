export interface Popup {
  id: number;
  title: string;
  detail_image_url: string | null;
  link_url: string | null;
  is_visible: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string | null;
  status: "waiting" | "active" | "ended";
  close_method: "today" | "days" | "never" | null;
  close_days: number | null;
}

export interface PopupFilter {
  startDate: string;
  endDate: string;
  status: string;
  searchCategory: string;
  searchQuery: string;
}

export interface PopupsResponse {
  popups: Popup[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}
