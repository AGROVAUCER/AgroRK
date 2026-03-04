// modules/admin/admin.routes.ts
import { Router } from "express";
import { auth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import { validate } from "../../utils/validate";
import {
  approveSignupRequestSchema,
  listSignupRequestsSchema,
  rejectSignupRequestSchema,
} from "./admin.schemas";
import { approveSignup, getSignupRequests, rejectSignup } from "./admin.controller";

const router = Router();

router.use(auth(), requireRole(["SUPER_ADMIN"]));

router.get(
  "/signup-requests",
  validate(listSignupRequestsSchema),
  getSignupRequests
);

router.post(
  "/signup-requests/:id/approve",
  validate(approveSignupRequestSchema),
  approveSignup
);

router.post(
  "/signup-requests/:id/reject",
  validate(rejectSignupRequestSchema),
  rejectSignup
);

export default router;
