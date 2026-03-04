// modules/auth/auth.service.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";
import { normalizeEmail, resolveAppRole, type AppRole } from "../../config/auth";

type UserRow = any;

const JWT_SECRET = (() => {
  const v = process.env.JWT_SECRET;
  if (!v) throw new Error("JWT_SECRET missing");
  return v;
})();

export const signAccessToken = (payload: { id: string; orgId: string | null; role: AppRole }) => {
  return jwt.sign(
    {
      sub: payload.id,
      orgId: payload.orgId ?? null,
      role: payload.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyPassword = async (passwordHash: string, password: string) => {
  return bcrypt.compare(String(password), String(passwordHash));
};

export const resolveJwtRole = (user: { role?: string | null; email?: string | null }): AppRole =>
  resolveAppRole(user.role ?? "USER", user.email ?? null);

export const findUserById = async (id: string): Promise<UserRow | null> => {
  const { data, error } = await supabaseAdmin
    .from("User")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
};

// postojeća funkcija (ostaje, koristi je signup)
export const findUserByEmailOrPhone = async (
  email: string | null,
  phone: string | null
): Promise<UserRow | null> => {
  if (!email && !phone) return null;

  let q = supabaseAdmin.from("User").select("*").limit(1);

  if (email) q = q.eq("email", normalizeEmail(email));
  if (phone) q = q.eq("phone", phone);

  const { data, error } = await q.maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
};

export const findUserByUsername = async (usernameRaw: string): Promise<UserRow | null> => {
  const username = String(usernameRaw ?? "").trim();
  if (!username) return null;

  const { data, error } = await supabaseAdmin
    .from("User")
    .select("*")
    .eq("username", username)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
};

// login lookup email -> username
export const findUserByIdentifier = async (identifierRaw: string): Promise<UserRow | null> => {
  const identifier = String(identifierRaw ?? "").trim();
  if (!identifier) return null;

  // 1) email
  {
    const email = identifier.toLowerCase();
    const { data, error } = await supabaseAdmin
      .from("User")
      .select("*")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) return data;
  }

  // 2) username
  {
    const { data, error } = await supabaseAdmin
      .from("User")
      .select("*")
      .eq("username", identifier)
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) return data;
  }

  return null;
};
