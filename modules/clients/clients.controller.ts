import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createClient, deleteClient, listClients, updateClient } from "./clients.service";

export const getClients = asyncHandler(async (req: Request, res: Response) => {
  const data = await listClients(req.orgId!);
  res.json(data);
});

export const postClient = asyncHandler(async (req: Request, res: Response) => {
  const client = await createClient(req.orgId!, req.body);
  res.status(201).json(client);
});

export const putClient = asyncHandler(async (req: Request, res: Response) => {
  const client = await updateClient(req.orgId!, req.params.id, req.body);
  res.json(client);
});

export const removeClient = asyncHandler(async (req: Request, res: Response) => {
  await deleteClient(req.orgId!, req.params.id);
  res.status(204).send();
});
