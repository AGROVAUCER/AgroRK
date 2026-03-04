import { randomUUID } from "crypto";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import { SUPER_ADMIN_EMAIL, normalizeEmail } from "../../config/auth";

export type CreateUserInput = {
  name: string;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  password: string;
  role: "ADMIN" | "USER";
  isActive?: boolean;
};

export type UpdateUserInput = {
  name?: string;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: "ADMIN" | "USER";
  isActive?: boolean;
  password?: string;
};

/* =========================================================
   LIST USERS (org scoped, hide super admin)
========================================================= */
export async function listUsers(orgId: string) {
  let query = supabaseAdmin
    .from("User")
    .select("id,name,username,email,phone,role,isActive,createdAt,updatedAt")
    .eq("orgId", orgId)
    .order("createdAt", { ascending: true });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).filter((row: any) => normalizeEmail(row.email) !== SUPER_ADMIN_EMAIL);
}

/* =========================================================
   CREATE USER (UUID fix)
========================================================= */
export async function createUser(orgId: string, input: CreateUserInput) {
  const id = randomUUID();
  const email = normalizeEmail(input.email);

  if (email === SUPER_ADMIN_EMAIL) {
    const e: any = new Error("Cannot create SUPER_ADMIN account in tenant scope");
    e.status = 403;
    throw e;
  }

  const passwordHash = await bcrypt.hash(String(input.password), 10);

  const row = {
    id,
    orgId,
    name: String(input.name ?? "").trim(),
    username: input.username ?? null,
    email: email || null,
    phone: input.phone ?? null,
    passwordHash,
    role: input.role,
    isActive: input.isActive ?? true,
  };

  const { data, error } = await supabaseAdmin
    .from("User")
    .insert(row)
    .select("id,name,username,email,phone,role,isActive,createdAt,updatedAt")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* =========================================================
   UPDATE USER (generic)  <-- da controller može da importuje updateUser
========================================================= */
export async function updateUser(orgId: string, userId: string, patch: UpdateUserInput) {
  const update: Record<string, unknown> = {};

  if (typeof patch.name === "string") update.name = patch.name;
  if ("username" in patch) update.username = patch.username ?? null;
  if ("email" in patch) {
    const email = normalizeEmail(patch.email);
    if (email === SUPER_ADMIN_EMAIL) {
      const e: any = new Error("Cannot assign SUPER_ADMIN email in tenant scope");
      e.status = 403;
      throw e;
    }
    update.email = email || null;
  }
  if ("phone" in patch) update.phone = patch.phone ?? null;
  if (patch.role) update.role = patch.role;
  if (typeof patch.isActive === "boolean") update.isActive = patch.isActive;
  if (typeof patch.password === "string" && patch.password.length > 0) {
    update.passwordHash = await bcrypt.hash(patch.password, 10);
  }

  const { data, error } = await supabaseAdmin
    .from("User")
    .update(update)
    .eq("id", userId)
    .eq("orgId", orgId)
    .select("id,name,username,email,phone,role,isActive,createdAt,updatedAt")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* =========================================================
   UPDATE ROLE (compat)
========================================================= */
export async function updateUserRole(orgId: string, userId: string, role: "ADMIN" | "USER") {
  return updateUser(orgId, userId, { role });
}

/* =========================================================
   SET ACTIVE / BLOCK (compat)
========================================================= */
export async function setUserActive(orgId: string, userId: string, isActive: boolean) {
  return updateUser(orgId, userId, { isActive });
}
