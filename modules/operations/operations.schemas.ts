import { z } from "zod";

export const createOperationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    aliases: z.array(z.string()).optional(),
  }),
});

export const updateOperationSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
    aliases: z.array(z.string()).optional(),
  }),
});
