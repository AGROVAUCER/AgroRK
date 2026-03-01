import { randomUUID } from "crypto";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export type CreateUserInput = {
  name: string;
  username?: string | null;
  email?: string | null;
  passwordHash: string;
  role: "ADMIN" | "USER";
  isActive?: boolean;
};

/* =========================================================
   LIST USERS (org scoped, without super admin)
========================================================= */

export async function listUsers(orgId: string) {
  const superAdminEmail = String(process.env.SUPER_ADMIN_EMAIL ?? "")
    .toLowerCase()
    .trim();

  let query = supabaseAdmin
    .from("User")
    .select(
      "id,name,username,email,role,isActive,createdAt,updatedAt"
    )
    .eq("orgId", orgId)
    .order("createdAt", { ascending: true });

  if (superAdminEmail) {
    query = query.neq("email", superAdminEmail);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

/* =========================================================
   CREATE USER (UUID fix + org scoped)
========================================================= */

export async function createUser(
  orgId: string,
  input: CreateUserInput
) {
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
    .select(
      "id,name,username,email,role,isActive,createdAt,updatedAt"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/* =========================================================
   UPDATE ROLE
========================================================= */

export async function updateUserRole(
  orgId: string,
  userId: string,
  role: "ADMIN" | "USER"
) {
  const { data, error } = await supabaseAdmin
    .from("User")
    .update({ role })
    .eq("id", userId)
    .eq("orgId", orgId)
    .select(
      "id,name,username,email,role,isActive,createdAt,updatedAt"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/* =========================================================
   SET ACTIVE / BLOCK
========================================================= */

export async function setUserActive(
  orgId: string,
  userId: string,
  isActive: boolean
) {
  const { data, error } = await supabaseAdmin
    .from("User")
    .update({ isActive })
    .eq("id", userId)
    .eq("orgId", orgId)
    .select(
      "id,name,username,email,role,isActive,createdAt,updatedAt"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}