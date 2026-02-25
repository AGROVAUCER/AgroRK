// modules/admin/admin.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  approveSignupRequest,
  listSignupRequests,
  rejectSignupRequest,
} from "../signupRequests/signupRequests.service";

function requireAdmin(req: any, res: Response) {
  if (!req.user?.role || req.user.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden" });
    return false;
  }
  return true;
}

export const getSignupRequests = asyncHandler(async (req: any, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const status = req.query?.status as any;
  const data = await listSignupRequests(status);

  return res.json({ data });
});

export const approveSignup = asyncHandler(async (req: any, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const requestId = req.params.id;
  const { orgId, role } = req.body ?? {};

  const out = await approveSignupRequest({
    requestId,
    orgId,
    role,
  });

  return res.json({ status: "APPROVED", userId: out.userId });
});

export const rejectSignup = asyncHandler(async (req: any, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const requestId = req.params.id;
  const note = req.body?.note;

  await rejectSignupRequest(requestId, note ?? null);

  return res.json({ status: "REJECTED" });
});