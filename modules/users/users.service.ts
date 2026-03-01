import { randomUUID } from "crypto";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";

export type CreateUserInput = {
  name: string;
  username?: string | null;
  email?: string | null;
  passwordHash: string;
  role: "ADMIN" | "USER";
  isActive?: boolean;
};

export type UpdateUserInput = {
  name?: string;
  username?: string | null;
  email?: string | null;
  role?: "ADMIN" | "USER";
  isActive?: boolean;
};

/* =========================================================
   LIST USERS (org scoped, hide super admin)
========================================================= */
export async function listUsers(orgId: string) {
  const superAdminEmail = String(process.env.SUPER_ADMIN_EMAIL ?? "")
    .toLowerCase()
    .trim();

  let query = supabaseAdmin
    .from("User")
    .select("id,name,username,email,role,isActive,createdAt,updatedAt")
    .eq("orgId", orgId)
    .order("createdAt", { ascending: true });

  if (superAdminEmail) query = query.neq("email", superAdminEmail);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

/* =========================================================
   CREATE USER (UUID fix)
========================================================= */
export async function createUser(orgId: string, input: CreateUserInput) {
  const id = randomUUID();

  const row = {
    id,
    orgId,
    name: input.name,
    username: input.username ?? null,
    email: input.email ?? null,
    passwordHash: input.passwordHash,
    role: input.role,
    isActive: input.isActive ?? true,
  };

  const { data, error } = await supabaseAdmin
    .from("User")
    .insert(row)
    .select("id,name,username,email,role,isActive,createdAt,updatedAt")
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
  if ("email" in patch) update.email = patch.email ?? null;
  if (patch.role) update.role = patch.role;
  if (typeof patch.isActive === "boolean") update.isActive = patch.isActive;

  const { data, error } = await supabaseAdmin
    .from("User")
    .update(update)
    .eq("id", userId)
    .eq("orgId", orgId)
    .select("id,name,username,email,role,isActive,createdAt,updatedAt")
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