export interface MemoData {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  reports: number;
}

export interface ApplicantData {
  no: number;
  applicationDate: string;
  nickname: string;
  name: string;
  email: string;
  phone: string;
}

export interface ProgramBasicInfo {
  programId: string;
  applicationCount: number;
  createdAt: string;
  viewCount: number;
  bookmarkCount: number;
}

export interface ProgramDetailInfo {
  title: string;
  eventDateTime: string;
  applicationPeriod: string;
  location: string;
  capacity: string;
  notes: string;
  keywords: string[];
  description: string;
  thumbnailUrl: string;
  isVisible: boolean;
  status: string;
}

// API 응답 타입
export interface ProgramResponse {
  id: string;
  title: string;
  event_date_time: string;
  application_start_at: string;
  application_end_at: string;
  location: string;
  capacity: number;
  notes: string;
  keyword: string[];
  description: string;
  thumbnail_url: string;
  is_visible: boolean;
  created_at: string;
  application_count: number;
  view_count: number;
  bookmark_count: number;
}

export interface MemoResponse {
  id: string;
  content: string;
  like_count: number;
  comment_count: number;
  created_at: string;
  user_id: string;
  users: {
    name: string;
    email: string;
  };
}

export interface ApplicationResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  user_id: string;
  users: {
    name: string;
    email: string;
  };
}
