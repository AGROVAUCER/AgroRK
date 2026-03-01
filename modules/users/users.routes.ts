import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { validate } from "../../utils/validate";
import { createUserSchema, updateUserSchema } from "./users.schemas";
import { getUsers, patchUser, postUser } from "./users.controller";

const router = Router();

router.use(auth(), orgScope);

router.get("/", getUsers);
router.post("/", validate(createUserSchema), postUser);
router.patch("/:id", validate(updateUserSchema), patchUser);

export default router;
