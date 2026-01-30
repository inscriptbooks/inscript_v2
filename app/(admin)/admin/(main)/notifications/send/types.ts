export interface SystemNotification {
  id: number;
  created_at: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
}

export interface NotificationsResponse {
  notifications: SystemNotification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface SystemNotificationFormData {
  title: string;
  message: string;
}

export interface TemplateFormData {
  title: string;
  type: string;
  content: string;
  isActive: boolean;
}
