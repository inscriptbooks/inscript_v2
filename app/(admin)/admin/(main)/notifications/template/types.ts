export interface FilterState {
  프로그램: boolean;
  희곡: boolean;
  작가: boolean;
  공지: boolean;
  커뮤니티: boolean;
  기타: boolean;
}

export interface TemplateData {
  id: string;
  type: string;
  content: string;
  sender: string;
  isEnabled: boolean;
  lastModified: string;
  isHighlighted?: boolean;
}

export interface TemplateFormData {
  title: string;
  type: string;
  content: string;
  isActive: boolean;
}
