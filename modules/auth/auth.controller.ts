// modules/auth/auth.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  findUserByEmailOrPhone,
  findUserById,
  signAccessToken,
  verifyPassword,
} from "./auth.service";

import { createSignupRequest } from "../signupRequests/signupRequests.service";
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, password } = req.body ?? {};

  if (!password || (!email && !phone)) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const user = await findUserByEmailOrPhone(email, phone);
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signAccessToken({ id: user.id, orgId: user.orgId, role: user.role });

  return res.json({
    accessToken: token,
    user: { id: user.id, name: user.name, role: user.role, orgId: user.orgId },
  });
});

export const me = asyncHandler(async (req: any, res: Response) => {
  if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

  const user = await findUserById(req.user.id);
  if (!user || !user.isActive) return res.status(401).json({ message: "Unauthorized" });

  return res.json({ id: user.id, name: user.name, role: user.role, orgId: user.orgId });
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body ?? {};

  if (!name || !password || (!email && !phone)) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : null;

  const normalizedPhone =
    typeof phone === "string" ? phone.trim() : null;

  await createSignupRequest({
    name: String(name).trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password: String(password),
  });

  return res.status(201).json({ status: "PENDING" });
});