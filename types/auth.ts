export type UserRole = "ADMIN" | "USER" | "SUPERADMIN";

export interface JwtUser {
  id: string;
  email: string;
  role: UserRole;
  orgId?: string;
}
