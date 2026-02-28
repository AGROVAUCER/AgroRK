import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createCrop,
  deleteCrop,
  listCrops,
  updateCrop,
  listCropVarieties,
  createCropVariety,
  deleteCropVariety,
} from "./crops.service";

export const getCrops = asyncHandler(async (req: Request, res: Response) => {
  const data = await listCrops(req.orgId!);
  res.json(data);
});

export const postCrop = asyncHandler(async (req: Request, res: Response) => {
  const crop = await createCrop(req.orgId!, req.body);
  res.status(201).json(crop);
});

export const putCrop = asyncHandler(async (req: Request, res: Response) => {
  const crop = await updateCrop(req.orgId!, req.params.id, req.body);
  res.json(crop);
});

export const removeCrop = asyncHandler(async (req: Request, res: Response) => {
  await deleteCrop(req.orgId!, req.params.id);
  res.status(204).send();
});

/* ============================
   Crop Varieties (Hibridi/Sortе)
============================ */

export const getCropVarieties = asyncHandler(async (req: Request, res: Response) => {
  const cropId = String(req.params.cropId);
  const data = await listCropVarieties(req.orgId!, cropId);
  res.json(data);
});

export const postCropVariety = asyncHandler(async (req: Request, res: Response) => {
  const cropId = String(req.params.cropId);
  const variety = await createCropVariety(req.orgId!, cropId, req.body);
  res.status(201).json(variety);
});

export const removeCropVariety = asyncHandler(async (req: Request, res: Response) => {
  const cropId = String(req.params.cropId);
  const varietyId = String(req.params.varietyId);
  await deleteCropVariety(req.orgId!, cropId, varietyId);
  res.status(204).send();
});