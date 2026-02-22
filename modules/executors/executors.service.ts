import { prisma } from "../../db/prisma";

export const listExecutors = (orgId: string) => {
  return prisma.executor.findMany({ where: { orgId }, orderBy: { name: "asc" } });
};

export const createExecutor = (orgId: string, data: any) => {
  return prisma.executor.create({ data: { ...data, aliases: data.aliases ?? [], orgId } });
};

export const updateExecutor = (orgId: string, id: string, data: any) => {
  return prisma.executor.update({ where: { id, orgId }, data });
};

export const deleteExecutor = (orgId: string, id: string) => {
  return prisma.executor.delete({ where: { id, orgId } });
};
