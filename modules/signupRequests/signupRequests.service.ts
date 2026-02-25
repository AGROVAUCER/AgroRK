// modules/signupRequests/signupRequests.service.ts
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";

export type SignupRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SignupRequestRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  passwordHash: string;
  status: SignupRequestStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createSignupRequest(input: {
  name: string;
  email: string | null;
  phone: string | null;
  password: string;
}) {
  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(input.password, 10);
  const now = new Date().toISOString();

  const { error } = await supabaseAdmin.from("SignupRequest").insert({
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash,
    status: "PENDING",
    note: null,
    createdAt: now,
    updatedAt: now,
  });

  if (error) throw new Error(error.message);
  return { id, status: "PENDING" as const };
}

export async function getSignupRequestById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("SignupRequest")
    .select("id,name,email,phone,passwordHash,status,note,createdAt,updatedAt")
    .eq("id", id)
    .maybeSingle<SignupRequestRow>();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function listSignupRequests(status?: SignupRequestStatus) {
  let q = supabaseAdmin
    .from("SignupRequest")
    .select("id,name,email,phone,status,note,createdAt,updatedAt")
    .order("createdAt", { ascending: false });

  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function rejectSignupRequest(id: string, note?: string | null) {
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("SignupRequest")
    .update({
      status: "REJECTED",
      note: note ?? null,
      updatedAt: now,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function approveSignupRequest(input: {
  requestId: string;
  orgId: string;
  role: "ADMIN" | "USER";
}) {
  const reqRow = await getSignupRequestById(input.requestId);
  if (!reqRow) {
    const e: any = new Error("Not found");
    e.statusCode = 404;
    throw e;
  }
  if (reqRow.status !== "PENDING") {
    const e: any = new Error("Not pending");
    e.statusCode = 409;
    throw e;
  }

  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  const { error: insErr } = await supabaseAdmin.from("User").insert({
    id: userId,
    name: reqRow.name,
    email: reqRow.email,
    phone: reqRow.phone,
    passwordHash: reqRow.passwordHash,
    role: input.role,
    isActive: true,
    orgId: input.orgId,
    createdAt: now,
    updatedAt: now,
  });

  if (insErr) throw new Error(insErr.message);

  const { error: updErr } = await supabaseAdmin
    .from("SignupRequest")
    .update({ status: "APPROVED", updatedAt: now })
    .eq("id", input.requestId);

  if (updErr) throw new Error(updErr.message);

  return { userId };
}