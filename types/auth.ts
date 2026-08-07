export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    id: string;
    profilePhoto: string | null;
    bio: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export interface RegisterState {
  error?: string | null;
  success?: boolean;
  message?:string
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
