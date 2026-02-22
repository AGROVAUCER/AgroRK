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
