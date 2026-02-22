import { prisma } from "../../db/prisma";

export const listCrops = (orgId: string) => {
  return prisma.crop.findMany({ where: { orgId }, orderBy: { name: "asc" } });
};

export const createCrop = (orgId: string, data: any) => {
  return prisma.crop.create({ data: { ...data, aliases: data.aliases ?? [], orgId } });
};

export const updateCrop = (orgId: string, id: string, data: any) => {
  return prisma.crop.update({ where: { id, orgId }, data });
};

export const deleteCrop = (orgId: string, id: string) => {
  return prisma.crop.delete({ where: { id, orgId } });
};
