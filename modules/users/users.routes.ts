import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { requireRole } from "../../middleware/requireRole";
import { validate } from "../../utils/validate";
import { createUserSchema, updateUserSchema } from "./users.schemas";
import { getUsers, patchUser, postUser } from "./users.controller";

const router = Router();

router.use(auth(), orgScope, requireRole(["ADMIN"]));

router.get("/", getUsers);
router.post("/", validate(createUserSchema), postUser);
router.patch("/:id", validate(updateUserSchema), patchUser);

export default router;
