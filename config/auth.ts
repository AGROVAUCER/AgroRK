export const SUPER_ADMIN_EMAIL = "sememikrobilja@gmail.com";

export type AppRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export const normalizeEmail = (value: string | null | undefined): string =>
  String(value ?? "").trim().toLowerCase();

export const isSuperAdminEmail = (value: string | null | undefined): boolean =>
  normalizeEmail(value) === SUPER_ADMIN_EMAIL;

export const resolveAppRole = (
  role: string | null | undefined,
  email: string | null | undefined
): AppRole => {
  if (isSuperAdminEmail(email)) return "SUPER_ADMIN";
  if (role === "ADMIN") return "ADMIN";
  return "USER";
};
