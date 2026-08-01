export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface RegisterState {
  error?: string;
  success?: boolean;
}
export interface LoginState {
  error?: string | null;
  success?: boolean;
}
