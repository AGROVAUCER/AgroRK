import { Router } from "express";
import { validate } from "../../utils/validate";
import { createFieldSchema, updateFieldSchema } from "./fields.schemas";
import { getFields, postField, putField, removeField } from "./fields.controller";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";

const router = Router();

router.use(auth({ optional: true }), orgScope);

router.get("/", getFields);
router.post("/", validate(createFieldSchema), postField);
router.put("/:id", validate(updateFieldSchema), putField);
router.delete("/:id", removeField);

export default router;
