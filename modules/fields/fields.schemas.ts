import { z } from "zod";

export const createFieldSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    area: z.number().positive(),
    unit: z.string().min(1),
    aliases: z.array(z.string()).optional(),
    currentCropId: z.string().optional(),
  }),
});

export const updateFieldSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    area: z.number().positive().optional(),
    unit: z.string().min(1).optional(),
    aliases: z.array(z.string()).optional(),
    currentCropId: z.string().optional().nullable(),
  }),
});
