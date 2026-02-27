import { z } from "zod";

export const createOperationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    applyTo: z.enum(["WORK", "SERVICE", "BOTH"]),
    aliases: z.array(z.string()).optional(),
    userName: z.string().min(1).optional(),
  }),
});

export const updateOperationSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    applyTo: z.enum(["WORK", "SERVICE", "BOTH"]).optional(),
    aliases: z.array(z.string()).optional(),
    userName: z.string().min(1).optional(),
  }),
});