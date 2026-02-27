// modules/entries/entries.schemas.ts
import { z } from "zod";

const entryBodySchema = z.object({
  entryType: z.enum(["WORK", "SERVICE"]),
  date: z.union([z.string(), z.date()]),
  fieldId: z.string().nullable().optional(),
  clientId: z.string().nullable().optional(),
  operationId: z.string(),
  cropId: z.string().nullable().optional(),
  executorId: z.string().nullable().optional(),
  quantity: z.number().nullable().optional(),
  unit: z.string().nullable().optional(),
  status: z.enum(["IN_PROGRESS", "DONE"]),
  note: z.string().nullable().optional(),
  source: z.enum(["VOICE", "WEB"]).optional(),
  voiceOriginalText: z.string().nullable().optional(),
});

export const createEntrySchema = z.object({
  body: entryBodySchema,
});

export const updateEntrySchema = z.object({
  params: z.object({ id: z.string() }),
  body: entryBodySchema.partial(),
});