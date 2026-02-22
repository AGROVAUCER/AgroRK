import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { validate } from "../../utils/validate";
import { createCropSchema, updateCropSchema } from "./crops.schemas";
import { getCrops, postCrop, putCrop, removeCrop } from "./crops.controller";

const router = Router();

router.use(auth({ optional: true }), orgScope);

router.get("/", getCrops);
router.post("/", validate(createCropSchema), postCrop);
router.put("/:id", validate(updateCropSchema), putCrop);
router.delete("/:id", removeCrop);

export default router;
