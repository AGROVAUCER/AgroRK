// modules/auth/auth.controller.ts
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  findUserByIdentifier,
  findUserByEmailOrPhone,
  findUserByUsername,
  findUserById,
  resolveJwtRole,
  signAccessToken,
  verifyPassword,
} from "./auth.service";

import { supabaseAdmin } from "../../src/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { createOrganization } from "../organizations/organizations.service";
import { isSuperAdminEmail } from "../../config/auth";

const missingOrgResponse = { message: "Missing orgId for user account" };

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, email, username, password } = req.body ?? {};

  if (!password || (!identifier && !email && !username)) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // glavna vrednost za lookup (email ili username)
  const rawIdentifier =
    typeof email === "string"
      ? email.trim()
      : typeof username === "string"
        ? username.trim()
        : typeof identifier === "string"
          ? identifier.trim()
          : "";

  if (!rawIdentifier) {
    return res.status(400).json({ message: "email or username is required" });
  }

  const user = await findUserByIdentifier(rawIdentifier);

  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const role = resolveJwtRole(user);
  if (role !== "SUPER_ADMIN" && !user.orgId) {
    return res.status(401).json(missingOrgResponse);
  }

  const token = signAccessToken({
    id: user.id,
    orgId: user.orgId ?? null,
    role,
  });

  return res.json({
    accessToken: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email ?? null,
      role,
      orgId: user.orgId,
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

  const role = resolveJwtRole(user);
  if (role !== "SUPER_ADMIN" && !user.orgId) {
    return res.status(401).json(missingOrgResponse);
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email ?? null,
    role,
    orgId: user.orgId,
  });
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, username, password } = req.body ?? {};

  if (!name || !password || (!email && !username)) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : null;

  const normalizedPhone = typeof phone === "string" ? phone.trim() : null;

  if (isSuperAdminEmail(normalizedEmail)) {
    return res.status(403).json({ message: "Reserved SUPER_ADMIN account" });
  }

  const existing = await findUserByEmailOrPhone(normalizedEmail, normalizedPhone);
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  if (typeof username === "string" && username.trim()) {
    const existingByUsername = await findUserByUsername(username);
    if (existingByUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  const tenant = await createOrganization(String(name));
  const now = new Date().toISOString();

  const newUser = {
    id: randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    username: typeof username === "string" ? username.trim() || null : null,
    passwordHash,
    role: "ADMIN",
    isActive: true,
    orgId: tenant.id,
    createdAt: now,
    updatedAt: now,
  };

  const { error } = await supabaseAdmin.from("User").insert(newUser);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const role = resolveJwtRole(newUser);
  const token = signAccessToken({
    id: newUser.id,
    orgId: newUser.orgId,
    role,
  });

  return res.status(201).json({
    accessToken: token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role,
      orgId: newUser.orgId,
    },
  });
});
