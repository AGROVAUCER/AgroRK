import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { validate } from "../../utils/validate";
import { createExecutorSchema, updateExecutorSchema } from "./executors.schemas";
import { getExecutors, postExecutor, putExecutor, removeExecutor } from "./executors.controller";

const router = Router();

router.use(auth({ optional: true }), orgScope);

router.get("/", getExecutors);
router.post("/", validate(createExecutorSchema), postExecutor);
router.put("/:id", validate(updateExecutorSchema), putExecutor);
router.delete("/:id", removeExecutor);

export default router;
