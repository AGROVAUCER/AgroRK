import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { listUsers, updateUser } from "../users/users.service";

export const adminGetUsers = asyncHandler(async (req: Request, res: Response) => {
  const data = await listUsers(req.orgId!);
  res.json(data);
});

export const adminBlockUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUser(req.orgId!, req.params.id, { isActive: false });
  res.json(user);
});

export const adminUnblockUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUser(req.orgId!, req.params.id, { isActive: true });
  res.json(user);
});