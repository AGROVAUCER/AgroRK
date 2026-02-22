import { Router } from "express";
import { validate } from "../../utils/validate";
import { loginSchema } from "./auth.schemas";
import { login, me } from "./auth.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", auth(), me);

export default router;
