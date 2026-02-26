import { Router } from "express";
import { auth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import {
  adminGetUsers,
  adminBlockUser,
  adminUnblockUser,
} from "./admin.users.controller";

const router = Router();

/**
 * Super admin global scope
 * NEMA orgScope jer mora da vidi sve organizacije
 */
router.use(auth(), requireRole(["ADMIN"]));

/**
 * GET /api/v1/admin/users
 * Lista svih korisnika (global)
 */
router.get("/users", adminGetUsers);

/**
 * POST /api/v1/admin/users/:id/block
 */
router.post("/users/:id/block", adminBlockUser);

/**
 * POST /api/v1/admin/users/:id/unblock
 */
router.post("/users/:id/unblock", adminUnblockUser);

export default router;