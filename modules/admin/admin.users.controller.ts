import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";
import { SUPER_ADMIN_EMAIL, normalizeEmail } from "../../config/auth";

/**
 * GET /api/v1/admin/users
 * Vraca sve korisnike iz svih organizacija
 */
export const adminGetUsers = asyncHandler(
  async (_req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin
      .from("User")
      .select("id,name,email,phone,role,orgId,isActive,createdAt")
      .order("createdAt", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    const rows = (data ?? []).filter((row: any) => normalizeEmail(row.email) !== SUPER_ADMIN_EMAIL);
    return res.json({ data: rows });
  }
);

/**
 * POST /api/v1/admin/users/:id/block
 * isActive = false
 */
export const adminBlockUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { data: target, error: targetErr } = await supabaseAdmin
      .from("User")
      .select("email")
      .eq("id", req.params.id)
      .maybeSingle<{ email: string | null }>();

    if (targetErr) {
      return res.status(500).json({ message: targetErr.message });
    }

    if (normalizeEmail(target?.email ?? null) === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ message: "SUPER_ADMIN account is protected" });
    }

    const { data, error } = await supabaseAdmin
      .from("User")
      .update({ isActive: false })
      .eq("id", req.params.id)
      .select("id,isActive")
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ data });
  }
);

/**
 * POST /api/v1/admin/users/:id/unblock
 * isActive = true
 */
export const adminUnblockUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { data: target, error: targetErr } = await supabaseAdmin
      .from("User")
      .select("email")
      .eq("id", req.params.id)
      .maybeSingle<{ email: string | null }>();

    if (targetErr) {
      return res.status(500).json({ message: targetErr.message });
    }

    if (normalizeEmail(target?.email ?? null) === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ message: "SUPER_ADMIN account is protected" });
    }

    const { data, error } = await supabaseAdmin
      .from("User")
      .update({ isActive: true })
      .eq("id", req.params.id)
      .select("id,isActive")
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ data });
  }
);
