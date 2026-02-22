import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma";
import { loadEnv } from "../../config/env";

const env = loadEnv();

export const findUserByEmailOrPhone = (email?: string, phone?: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        email ? { email } : undefined,
        phone ? { phone } : undefined,
      ].filter(Boolean) as any[],
    },
  });
};

export const verifyPassword = (hash: string, password: string) => {
  return bcrypt.compare(password, hash);
};

export const signAccessToken = (user: { id: string; orgId: string | null; role: string }) => {
  const payload = {
    sub: user.id,
    orgId: user.orgId,
    role: user.role,
  };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};
