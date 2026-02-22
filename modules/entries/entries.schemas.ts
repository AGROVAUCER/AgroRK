import { z } from "zod";

export const createEntrySchema = z.object({
  body: z.object({
    entryType: z.enum(["WORK", "SERVICE"]),
    date: z.string().or(z.date()),
    fieldId: z.string().optional().nullable(),
    clientId: z.string().optional().nullable(),
    operationId: z.string(),
    cropId: z.string().optional().nullable(),
    executorId: z.string().optional().nullable(),
    quantity: z.number().optional(),
    unit: z.string().optional().nullable(),
    status: z.enum(["IN_PROGRESS", "DONE"]),
    note: z.string().optional().nullable(),
    source: z.enum(["VOICE", "WEB"]).optional(),
    voiceOriginalText: z.string().optional().nullable(),
  }),
});

export const updateEntrySchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    entryType: z.enum(["WORK", "SERVICE"]).optional(),
    date: z.string().or(z.date()).optional(),
    fieldId: z.string().optional().nullable(),
    clientId: z.string().optional().nullable(),
    operationId: z.string().optional(),
    cropId: z.string().optional().nullable(),
    executorId: z.string().optional().nullable(),
    quantity: z.number().optional().nullable(),
    unit: z.string().optional().nullable(),
    status: z.enum(["IN_PROGRESS", "DONE"]).optional(),
    note: z.string().optional().nullable(),
    source: z.enum(["VOICE", "WEB"]).optional(),
    voiceOriginalText: z.string().optional().nullable(),
  }),
});
