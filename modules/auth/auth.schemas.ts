// modules/auth/auth.schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().min(3).optional(),
      password: z.string().min(6),
    })
    .refine((data) => data.email || data.phone, {
      message: "email or phone is required",
      path: ["email"],
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