export interface PlayData {
  id: string;
  title: string;
  summary: string;
  keyword: string[];
  line1: string | null;
  line2: string | null;
  line3: string | null;
  year: string | null;
  country: string | null;
  female_character_count: string | null;
  male_character_count: string | null;
  character_list: string[];
  public_history: string | null;
  public_status: "published" | "unpublished" | "outOfPrint" | null;
  apply_status: "applied" | "review" | "accepted" | "rejected";
  rejection_reason: string | null;
  is_visible: boolean;
  view_count: number;
  bookmark_count: number;
  created_at: string;
  created_by_id: string | null;
  author_id: string | null;
  created_by?: {
    id: string;
    name: string | null;
    name_en: string | null;
    email: string;
  };
  author?: {
    id: string;
    author_name: string;
    author_name_en: string | null;
  };
  // 판매 관련
  sales_status: "판매함" | "판매 안 함" | null;
  price: number | null;
  attachment_url: string | null;
  attachment_name: string | null;
}
