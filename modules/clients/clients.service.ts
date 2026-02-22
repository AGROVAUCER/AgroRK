import { prisma } from "../../db/prisma";

export const listClients = (orgId: string) => {
  return prisma.client.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } });
};

export const createClient = (orgId: string, data: any) => {
  return prisma.client.create({
    data: {
      ...data,
      aliases: data.aliases ?? [],
      orgId,
    },
  });
};

export const updateClient = (orgId: string, id: string, data: any) => {
  return prisma.client.update({ where: { id, orgId }, data });
};

export const deleteClient = (orgId: string, id: string) => {
  return prisma.client.delete({ where: { id, orgId } });
};
