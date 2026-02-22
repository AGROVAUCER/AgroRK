import { z } from "zod";

export const createExecutorSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    aliases: z.array(z.string()).optional(),
  }),
});

export const updateExecutorSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    aliases: z.array(z.string()).optional(),
  }),
});
