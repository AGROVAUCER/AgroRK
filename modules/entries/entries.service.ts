import { prisma } from "../../db/prisma";
import { EntryType, EntryStatus, EntrySource } from "@prisma/client";

type ListFilters = {
  orgId: string;
  dateFrom?: Date;
  dateTo?: Date;
  entryType?: EntryType;
  fieldId?: string;
  clientId?: string;
  operationId?: string;
  status?: EntryStatus;
  executorId?: string;
  search?: string;
  limit?: number;
  cursor?: string;
};

export const listEntries = (filters: ListFilters) => {
  const take = Math.min(Math.max(filters.limit ?? 20, 1), 100);
  const where: any = { orgId: filters.orgId };
  if (filters.dateFrom || filters.dateTo) {
    where.date = {};
    if (filters.dateFrom) where.date.gte = filters.dateFrom;
    if (filters.dateTo) where.date.lte = filters.dateTo;
  }
  if (filters.entryType) where.entryType = filters.entryType;
  if (filters.fieldId) where.fieldId = filters.fieldId;
  if (filters.clientId) where.clientId = filters.clientId;
  if (filters.operationId) where.operationId = filters.operationId;
  if (filters.status) where.status = filters.status;
  if (filters.executorId) where.executorId = filters.executorId;
  if (filters.search) {
    where.OR = [
      { note: { contains: filters.search, mode: "insensitive" } },
      { voiceOriginalText: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.workEntry.findMany({
    where,
    orderBy: { date: "desc" },
    take,
    skip: filters.cursor ? 1 : 0,
    cursor: filters.cursor ? { id: filters.cursor } : undefined,
    include: {
      field: true,
      client: true,
      operation: true,
      crop: true,
      executor: true,
      createdBy: true,
    },
  });
};

export const getEntry = (orgId: string, id: string) => {
  return prisma.workEntry.findFirst({
    where: { id, orgId },
    include: {
      field: true,
      client: true,
      operation: true,
      crop: true,
      executor: true,
      createdBy: true,
    },
  });
};

export const ensureEntryRules = async (orgId: string, data: any) => {
  const entryType = data.entryType;
  if (entryType === "WORK") {
    if (!data.fieldId) throw { status: 400, message: "fieldId is required for WORK" };
    data.clientId = null;
  }
  if (entryType === "SERVICE") {
    if (!data.clientId) throw { status: 400, message: "clientId is required for SERVICE" };
    data.fieldId = null;
  }
  if (!data.operationId) throw { status: 400, message: "operationId is required" };
  if (!data.date) throw { status: 400, message: "date is required" };
  if (!data.status) throw { status: 400, message: "status is required" };

  // Sowing rule
  const op = await prisma.operation.findFirst({ where: { id: data.operationId, orgId } });
  if (!op) throw { status: 400, message: "Invalid operationId" };
  if (op.canonicalKey?.toUpperCase() === "SOWING" && !data.cropId) {
    throw { status: 400, message: "cropId is required for SOWING operation" };
  }
};

export const createEntry = (orgId: string, createdByUserId: string, data: any) => {
  return prisma.workEntry.create({
    data: {
      date: data.date ? new Date(data.date) : new Date(),
      entryType: data.entryType,
      fieldId: data.fieldId ?? null,
      clientId: data.clientId ?? null,
      operationId: data.operationId,
      cropId: data.cropId ?? null,
      executorId: data.executorId ?? null,
      quantity: data.quantity ?? null,
      unit: data.unit ?? null,
      status: data.status,
      note: data.note ?? null,
      source: data.source ?? EntrySource.WEB,
      voiceOriginalText: data.voiceOriginalText ?? null,
      createdByUserId,
      orgId,
    },
  });
};

export const updateEntry = (orgId: string, id: string, data: any) => {
  return prisma.workEntry.update({
    where: { id, orgId },
    data: {
      date: data.date ? new Date(data.date) : undefined,
      entryType: data.entryType,
      fieldId: data.fieldId ?? undefined,
      clientId: data.clientId ?? undefined,
      operationId: data.operationId,
      cropId: data.cropId ?? undefined,
      executorId: data.executorId ?? undefined,
      quantity: data.quantity,
      unit: data.unit,
      status: data.status,
      note: data.note,
      source: data.source,
      voiceOriginalText: data.voiceOriginalText,
    },
  });
};

export const deleteEntry = (orgId: string, id: string) => {
  return prisma.workEntry.delete({
    where: { id, orgId },
  });
};
