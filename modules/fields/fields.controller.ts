import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createField, deleteField, listFields, updateField } from "./fields.service";

export const getFields = asyncHandler(async (req: Request, res: Response) => {
  const fields = await listFields(req.orgId!);
  res.json(fields);
});

export const postField = asyncHandler(async (req: Request, res: Response) => {
  const field = await createField(req.orgId!, req.body);
  res.status(201).json(field);
});

export const putField = asyncHandler(async (req: Request, res: Response) => {
  const field = await updateField(req.orgId!, req.params.id, req.body);
  res.json(field);
});

export const removeField = asyncHandler(async (req: Request, res: Response) => {
  await deleteField(req.orgId!, req.params.id);
  res.status(204).send();
});
