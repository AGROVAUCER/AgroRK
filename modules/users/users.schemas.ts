import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().min(3).optional(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "USER"]).default("USER"),
    isActive: z.boolean().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(3).optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    isActive: z.boolean().optional(),
    password: z.string().min(6).optional(),
  }),
});
