export interface PaymentRow {
  id: number;
  user_id: string;
  order_id: string;
  payment_key: string;
  status: string;
  amount: number;
  order_name: string | null;
  method: string | null;
  approved_at: string | null;
  card_company: string | null;
  card_number_masked: string | null;
  receipt_url: string | null;
  raw: any;
  agree_refund_terms: boolean;
  created_at: string;
  updated_at: string;
}
