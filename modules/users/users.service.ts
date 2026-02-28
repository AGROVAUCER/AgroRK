import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";

type UserRow = any;

export const listUsers = async (orgId: string): Promise<UserRow[]> => {
  const { data, error } = await supabaseAdmin
    .from("User")
    .select("*")
    .eq("orgId", orgId)
    .order("createdAt", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const createUser = async (orgId: string, payload: any): Promise<UserRow> => {
  const passwordHash = await bcrypt.hash(payload.password, 10);

  const row = {
    name: payload.name,
    username: payload.username, // NOVO
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    passwordHash,
    role: payload.role,
    isActive: payload.isActive ?? true,
    orgId,
  };

  const { data, error } = await supabaseAdmin.from("User").insert(row).select("*").single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateUser = async (orgId: string, id: string, patch: any): Promise<UserRow> => {
  const updateData: any = {
    name: patch.name,
    username: patch.username, // NOVO
    email: patch.email,
    phone: patch.phone,
    role: patch.role,
    isActive: patch.isActive,
  };

  if (patch.password) {
    updateData.passwordHash = await bcrypt.hash(patch.password, 10);
  }

  const { data, error } = await supabaseAdmin
    .from("User")
    .update(updateData)
    .eq("orgId", orgId)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
};