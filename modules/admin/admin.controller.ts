// modules/admin/admin.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  approveSignupRequest,
  listSignupRequests,
  rejectSignupRequest,
} from "../signupRequests/signupRequests.service";

export const getSignupRequests = asyncHandler(async (req: any, res: Response) => {
  const status = req.query?.status as any;
  const data = await listSignupRequests(status);

  return res.json({ data });
});

export const approveSignup = asyncHandler(async (req: any, res: Response) => {
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
  const requestId = req.params.id;
  const note = req.body?.note;

  await rejectSignupRequest(requestId, note ?? null);

  return res.json({ status: "REJECTED" });
});
