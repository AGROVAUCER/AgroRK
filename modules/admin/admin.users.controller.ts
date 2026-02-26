import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { supabaseAdmin } from "../../src/lib/supabaseAdmin";

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

    return res.json({ data: data ?? [] });
  }
);

/**
 * POST /api/v1/admin/users/:id/block
 * isActive = false
 */
export const adminBlockUser = asyncHandler(
  async (req: Request, res: Response) => {
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