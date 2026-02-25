// modules/admin/admin.schemas.ts
import { z } from "zod";

export const listSignupRequestsSchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  }),
});

export const approveSignupRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    orgId: z.string().min(1),
    role: z.enum(["ADMIN", "USER"]),
  }),
});

export const rejectSignupRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      note: z.string().max(500).optional(),
    })
    .optional(),
});