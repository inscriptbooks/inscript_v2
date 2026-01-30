export type NotificationType = "comment" | "like" | "program" | "memo" | "post" | "system";

export interface NotificationAuthor {
  id: string;
  name: string;
  thumbnail?: string;
}

export interface NotificationMemo {
  id: string;
  title?: string;
  content: string;
}

export interface NotificationPost {
  id: string;
  title: string;
  type: string;
  category: string;
}

export interface Notification {
  id: string; // uuid로 변경
  created_at: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  memo_id?: string;
  post_id?: string;
  comment_id?: string;
  author_id?: string;
  author?: NotificationAuthor;
  memo?: NotificationMemo;
  post?: NotificationPost;
}

export interface NotificationListResponse {
  notifications: Notification[];
}

// 새 콘텐츠 알림 타입 (최근 7일 이내)
export interface NewContentNotification {
  id: string;
  type: "post" | "program";
  title: string;
  message: string;
  created_at: string;
  link: string;
  is_read: boolean;
  metadata: {
    post_id?: string;
    post_title?: string;
    post_type?: string;
    post_category?: string;
    program_id?: string;
    program_title?: string;
    event_date_time?: string;
    location?: string;
    thumbnail_url?: string;
    author?: NotificationAuthor;
  };
}

export interface NewContentResponse {
  newContent: NewContentNotification[];
}

// 읽음 처리 요청 타입
export interface MarkReadRequest {
  notification_id: string;
  notification_type: "system" | "post" | "program";
}
