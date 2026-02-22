import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createExecutor, deleteExecutor, listExecutors, updateExecutor } from "./executors.service";

export const getExecutors = asyncHandler(async (req: Request, res: Response) => {
  const data = await listExecutors(req.orgId!);
  res.json(data);
});

export const postExecutor = asyncHandler(async (req: Request, res: Response) => {
  const executor = await createExecutor(req.orgId!, req.body);
  res.status(201).json(executor);
});

export const putExecutor = asyncHandler(async (req: Request, res: Response) => {
  const executor = await updateExecutor(req.orgId!, req.params.id, req.body);
  res.json(executor);
});

export const removeExecutor = asyncHandler(async (req: Request, res: Response) => {
  await deleteExecutor(req.orgId!, req.params.id);
  res.status(204).send();
});
