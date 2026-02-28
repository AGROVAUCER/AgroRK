// modules/auth/auth.schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  body: z
    .object({
      // NOVO (glavno): web šalje email, mobile šalje username
      identifier: z.string().min(1).optional(),

      // BACKWARD COMPAT (da ne polomi stare klijente)
      email: z.string().email().optional(),
      phone: z.string().min(3).optional(),

      password: z.string().min(6),
    })
    .refine((data) => data.identifier || data.email || data.phone, {
      message: "identifier (or email/phone) is required",
      path: ["identifier"],
    }),
});

export const signupSchema = z.object({
  body: z
    .object({
      name: z.string().min(2),
      email: z.string().email().optional(),
      phone: z.string().min(3).optional(),
      password: z.string().min(6),
    })
    .refine((data) => data.email || data.phone, {
      message: "email or phone is required",
      path: ["email"],
    }),
});