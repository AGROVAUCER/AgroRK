import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createOperation, deleteOperation, listOperations, updateOperation } from "./operations.service";

export const getOperations = asyncHandler(async (req: Request, res: Response) => {
  const data = await listOperations(req.orgId!);
  res.json(data);
});

export const postOperation = asyncHandler(async (req: Request, res: Response) => {
  const op = await createOperation(req.orgId!, req.body);
  res.status(201).json(op);
});

export const putOperation = asyncHandler(async (req: Request, res: Response) => {
  const op = await updateOperation(req.orgId!, req.params.id, req.body);
  res.json(op);
});

export const removeOperation = asyncHandler(async (req: Request, res: Response) => {
  await deleteOperation(req.orgId!, req.params.id);
  res.status(204).send();
});
