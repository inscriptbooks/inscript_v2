export interface Banner {
  id: string;
  title: string;
  type: "main" | "ad";
  image_url?: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchKeyword {
  id: number;
  keyword: string;
  user_id?: string;
  created_at: string;
}

export interface FooterData {
  companyName: string;
  businessNumber: string;
  address: string;
  email: string;
  mailOrderNumber: string;
  phone: string;
}

export interface MainConfig {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}
