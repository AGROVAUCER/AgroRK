import { z } from "zod";

export const loginSchema = z.object({
  body: z
    .object({
      identifier: z.string().min(1).optional(),
      email: z.string().email().optional(),
      username: z.string().min(2).optional(),
      password: z.string().min(6),
    })
    .refine((data) => data.identifier || data.email || data.username, {
      message: "email or username is required",
      path: ["identifier"],
    }),
});

export const signupSchema = z.object({
  body: z
    .object({
      name: z.string().min(2),
      email: z.string().email().optional(),
      username: z.string().min(2).optional(),
      phone: z.string().min(3).optional(),
      password: z.string().min(6),
    })
    .refine((data) => data.email || data.username, {
      message: "email or username is required",
      path: ["email"],
    }),
});
