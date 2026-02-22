import { z } from "zod";

export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    location: z.string().optional(),
    aliases: z.array(z.string()).optional(),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    aliases: z.array(z.string()).optional(),
  }),
});
