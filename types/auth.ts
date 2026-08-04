export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface RegisterState {
  error?: string | null;
  success?: boolean;
}
export interface LoginState {
  error?: string | null;
  success?: boolean;
  role?: UserRole;
}

type FormState = {
  error?: string | null;
  success?: boolean;
  role?: UserRole;
};

export const initialState: FormState = {
  error: null,
  success: false,
};
