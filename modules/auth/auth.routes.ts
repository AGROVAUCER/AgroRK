// modules/auth/auth.routes.ts
import { Router } from "express";
import { validate } from "../../utils/validate";
import { loginSchema, signupSchema } from "./auth.schemas";
import { login, me, signup } from "./auth.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signupSchema), signup);
router.get("/me", auth(), me);

export default router;