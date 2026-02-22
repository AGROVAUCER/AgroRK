import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { findUserByEmailOrPhone, signAccessToken, verifyPassword } from "./auth.service";
import { prisma } from "../../db/prisma";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;
  const user = await findUserByEmailOrPhone(email, phone);
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signAccessToken({ id: user.id, orgId: user.orgId, role: user.role });
  res.json({
    accessToken: token,
    user: { id: user.id, name: user.name, role: user.role, orgId: user.orgId },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || !user.isActive) return res.status(401).json({ message: "Unauthorized" });
  res.json({ id: user.id, name: user.name, role: user.role, orgId: user.orgId });
});
