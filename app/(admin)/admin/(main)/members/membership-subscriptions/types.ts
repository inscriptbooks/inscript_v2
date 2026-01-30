export interface MembershipSubscription {
  id: number;
  memberId: string;
  nickname: string;
  email: string;
  subscriptionStatus: "active" | "failed" | "cancelled";
  lastLogin: string;
  joinDate: string;
  paymentAmount: string;
}

export type SubscriptionStatus = "active" | "failed" | "cancelled";
export type PaymentMethod = "all" | "card" | "bank" | "kakao" | "paypal";
export type FilterStatus = "all" | "active" | "failed" | "cancelled";
