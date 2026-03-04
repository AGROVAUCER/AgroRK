export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export interface JwtUser {
  id: string;
  email?: string | null;
  role: UserRole;
  orgId: string | null;
}
