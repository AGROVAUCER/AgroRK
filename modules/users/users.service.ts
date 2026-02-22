import bcrypt from "bcryptjs";
import { prisma } from "../../db/prisma";

export const listUsers = (orgId: string) => {
  return prisma.user.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } });
};

export const createUser = async (orgId: string, data: any) => {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role,
      isActive: data.isActive ?? true,
      orgId,
    },
  });
};

export const updateUser = async (orgId: string, id: string, data: any) => {
  const updateData: any = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    isActive: data.isActive,
  };
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }
  return prisma.user.update({
    where: { id, orgId },
    data: updateData,
  });
};
