import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    username: z.string().min(2), // obavezno
    email: z.string().email().optional().nullable(),
    phone: z.string().min(3).optional().nullable(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "USER"]).default("USER"),
    isActive: z.boolean().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    username: z.string().min(2).optional(),
    email: z.string().email().optional().nullable(),
    phone: z.string().min(3).optional().nullable(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    isActive: z.boolean().optional(),
    password: z.string().min(6).optional(),
  }),
});