import { z } from "zod";

export const createCropSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    aliases: z.array(z.string()).optional(),
  }),
});

export const updateCropSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    aliases: z.array(z.string()).optional(),
  }),
});

/* ============================
   Crop Varieties (Hibridi/Sortе)
============================ */

export const createCropVarietySchema = z.object({
  params: z.object({ cropId: z.string() }),
  body: z.object({
    name: z.string().min(1),
  }),
});

export const deleteCropVarietySchema = z.object({
  params: z.object({
    cropId: z.string(),
    varietyId: z.string(),
  }),
});