export type UserRole = "admin" | "user" | "author";
export type AuthProvider = "google" | "kakao" | "local";
export type UserStatus = "active" | "suspended" | "blacklist";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  nameEn?: string;
  email: string;
  phone?: string;
  authProvider: AuthProvider;
  createdAt: string;
  status: UserStatus;
  lastLogin?: string;
  thumbnail?: string;
  membership?: boolean;
  membershipStartDate?: string;
}
