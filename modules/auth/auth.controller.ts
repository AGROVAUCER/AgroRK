// modules/auth/auth.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  findUserByIdentifier,
  findUserByEmailOrPhone,
  findUserById,
  signAccessToken,
  verifyPassword,
} from "./auth.service";

import { supabaseAdmin } from "../../src/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, email, phone, password } = req.body ?? {};

  if (!password || (!identifier && !email && !phone)) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // glavna vrednost za lookup
  const rawIdentifier =
    typeof identifier === "string"
      ? identifier.trim()
      : typeof email === "string"
        ? email.trim()
        : typeof phone === "string"
          ? phone.trim()
          : "";

  if (!rawIdentifier) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const user = await findUserByIdentifier(rawIdentifier);

  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signAccessToken({
    id: user.id,
    orgId: user.orgId,
    role: user.role,
  });

  return res.json({
    accessToken: token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      orgId: user.orgId,
      username: user.username ?? null,
      email: user.email ?? null,
    },
  });
});

export const me = asyncHandler(async (req: any, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await findUserById(req.user.id);
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json({
    id: user.id,
    name: user.name,
    role: user.role,
    orgId: user.orgId,
    username: user.username ?? null,
    email: user.email ?? null,
  });
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body ?? {};

  if (!name || !password || (!email && !phone)) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : null;

  const normalizedPhone = typeof phone === "string" ? phone.trim() : null;

  const existing = await findUserByEmailOrPhone(normalizedEmail, normalizedPhone);
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  const now = new Date().toISOString();

  const newUser = {
    id: randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    username: null, // signup flow ti je trenutno bez org-a; ostavljam kako je bilo
    passwordHash,
    role: "USER",
    isActive: true,
    orgId: null,
    createdAt: now,
    updatedAt: now,
  };

  const { error } = await supabaseAdmin.from("User").insert(newUser);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const token = signAccessToken({
    id: newUser.id,
    orgId: newUser.orgId,
    role: newUser.role,
  });

  return res.status(201).json({
    accessToken: token,
    user: {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      orgId: newUser.orgId,
      username: null,
      email: newUser.email,
    },
  });
});