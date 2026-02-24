import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createEntry, deleteEntry, ensureEntryRules, getEntry, listEntries, updateEntry } from "./entries.service";

export const getEntries = asyncHandler(async (req: Request, res: Response) => {
  const {
    dateFrom,
    dateTo,
    type,
    fieldId,
    clientId,
    operationId,
    status,
    executorId,
    search,
    cursor,
    limit,
  } = req.query;

  const data = await listEntries({
    orgId: req.orgId!,
    dateFrom: dateFrom ? new Date(String(dateFrom)) : undefined,
    dateTo: dateTo ? new Date(String(dateTo)) : undefined,
    entryType: type ? String(type).toUpperCase() as any : undefined,
    fieldId: fieldId as string | undefined,
    clientId: clientId as string | undefined,
    operationId: operationId as string | undefined,
    status: status ? String(status).toUpperCase() as any : undefined,
    executorId: executorId as string | undefined,
    search: search as string | undefined,
    cursor: cursor as string | undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.json(data);
});

export const getEntryById = asyncHandler(async (req: Request, res: Response) => {
  const entry = await getEntry(req.orgId!, req.params.id);
  if (!entry) return res.status(404).json({ message: "Not found" });
  res.json(entry);
});

export const postEntry = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  await ensureEntryRules(req.orgId!, body);
  const entry = await createEntry(req.orgId!, req.user?.id || "", {
    ...body,
    source: body.source || "WEB",
  });
  res.status(201).json(entry);
});

export const patchEntry = asyncHandler(async (req: Request, res: Response) => {
  const existing = await getEntry(req.orgId!, req.params.id);
  if (!existing) return res.status(404).json({ message: "Not found" });
  // permissions
  if (req.user?.role !== "ADMIN" && existing.createdByUserId !== req.user?.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const body = req.body;
  await ensureEntryRules(req.orgId!, { ...existing, ...body, entryType: body.entryType ?? existing.entryType });
  const updated = await updateEntry(req.orgId!, req.params.id, body);
  res.json(updated);
});

export const removeEntry = asyncHandler(async (req: Request, res: Response) => {
  const existing = await getEntry(req.orgId!, req.params.id);
  if (!existing) return res.status(404).json({ message: "Not found" });
  if (req.user?.role !== "ADMIN" && existing.createdByUserId !== req.user?.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await deleteEntry(req.orgId!, req.params.id);
  res.status(204).send();
});
