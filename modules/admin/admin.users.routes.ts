import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { requireRole } from "../../middleware/requireRole";
import {
  adminGetUsers,
  adminBlockUser,
  adminUnblockUser,
} from "./admin.users.controller";

const router = Router();

// isti auth/role model kao users modul
router.use(auth(), orgScope, requireRole(["ADMIN"]));

// GET /api/v1/admin/users
router.get("/users", adminGetUsers);

// POST /api/v1/admin/users/:id/block
router.post("/users/:id/block", adminBlockUser);

// POST /api/v1/admin/users/:id/unblock
router.post("/users/:id/unblock", adminUnblockUser);

export default router;