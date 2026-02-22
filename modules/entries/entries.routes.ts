import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { validate } from "../../utils/validate";
import { createEntrySchema, updateEntrySchema } from "./entries.schemas";
import { getEntries, getEntryById, patchEntry, postEntry, removeEntry } from "./entries.controller";

const router = Router();

router.use(auth(), orgScope);

router.get("/", getEntries);
router.get("/:id", getEntryById);
router.post("/", validate(createEntrySchema), postEntry);
router.patch("/:id", validate(updateEntrySchema), patchEntry);
router.delete("/:id", removeEntry);

export default router;
