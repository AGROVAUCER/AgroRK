import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { validate } from "../../utils/validate";
import { createOperationSchema, updateOperationSchema } from "./operations.schemas";
import { getOperations, postOperation, putOperation, removeOperation } from "./operations.controller";

const router = Router();

router.use(auth({ optional: true }), orgScope);

router.get("/", getOperations);
router.post("/", validate(createOperationSchema), postOperation);
router.put("/:id", validate(updateOperationSchema), putOperation);
router.delete("/:id", (_req, res) => res.status(405).json({ message: "Deleting operations is not allowed" }));

export default router;
