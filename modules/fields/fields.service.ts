import { prisma } from "../../db/prisma";

export const listFields = (orgId: string) => {
  return prisma.field.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });
};

export const createField = (orgId: string, data: any) => {
  return prisma.field.create({
    data: {
      ...data,
      aliases: data.aliases ?? [],
      orgId,
    },
  });
};

export const updateField = (orgId: string, id: string, data: any) => {
  return prisma.field.update({
    where: { id, orgId },
    data,
  });
};

export const deleteField = (orgId: string, id: string) => {
  return prisma.field.delete({
    where: { id, orgId },
  });
};
