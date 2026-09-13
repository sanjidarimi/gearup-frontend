export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    profilePhoto: string | null;
    bio: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface AuthTokenPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface ActionResult {
  success: boolean;
  message: string;
  role?: UserRole;
}
