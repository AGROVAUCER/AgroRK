import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { validate } from "../../utils/validate";
import {
  createCropSchema,
  updateCropSchema,
  createCropVarietySchema,
  deleteCropVarietySchema,
} from "./crops.schemas";
import {
  getCrops,
  postCrop,
  putCrop,
  removeCrop,
  getCropVarieties,
  postCropVariety,
  removeCropVariety,
} from "./crops.controller";

const router = Router();

router.use(auth({ optional: true }), orgScope);

router.get("/", getCrops);
router.post("/", validate(createCropSchema), postCrop);
router.put("/:id", validate(updateCropSchema), putCrop);
router.delete("/:id", removeCrop);

/* Varieties (Hibridi/Sortе) */
router.get("/:cropId/varieties", getCropVarieties);
router.post("/:cropId/varieties", validate(createCropVarietySchema), postCropVariety);
router.delete("/:cropId/varieties/:varietyId", validate(deleteCropVarietySchema), removeCropVariety);

export default router;