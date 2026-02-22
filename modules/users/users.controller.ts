import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createUser, listUsers, updateUser } from "./users.service";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const data = await listUsers(req.orgId!);
  res.json(data);
});

export const postUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await createUser(req.orgId!, req.body);
  res.status(201).json(user);
});

export const patchUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUser(req.orgId!, req.params.id, req.body);
  res.json(user);
});
