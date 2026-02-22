import { prisma } from "../../db/prisma";

export const listOperations = (orgId: string) => {
  return prisma.operation.findMany({ where: { orgId }, orderBy: { name: "asc" } });
};

export const createOperation = (orgId: string, data: any) => {
  return prisma.operation.create({
    data: { ...data, aliases: data.aliases ?? [], orgId },
  });
};

export const updateOperation = (orgId: string, id: string, data: any) => {
  const updateData: any = {};
  if (data.userName !== undefined) updateData.userName = data.userName;
  if (data.applyTo !== undefined) updateData.applyTo = data.applyTo;
  if (data.aliases !== undefined) updateData.aliases = data.aliases ?? [];
  // name and canonicalKey are locked
  return prisma.operation.update({ where: { id, orgId }, data: updateData });
};

export const deleteOperation = (orgId: string, id: string) => {
  return prisma.operation.delete({ where: { id, orgId } });
};
