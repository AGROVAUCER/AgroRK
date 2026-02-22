"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCrop = exports.updateCrop = exports.createCrop = exports.listCrops = void 0;
const prisma_1 = require("../../db/prisma");
const listCrops = (orgId) => {
    return prisma_1.prisma.crop.findMany({ where: { orgId }, orderBy: { name: "asc" } });
};
exports.listCrops = listCrops;
const createCrop = (orgId, data) => {
    return prisma_1.prisma.crop.create({ data: { ...data, aliases: data.aliases ?? [], orgId } });
};
exports.createCrop = createCrop;
const updateCrop = (orgId, id, data) => {
    return prisma_1.prisma.crop.update({ where: { id, orgId }, data });
};
exports.updateCrop = updateCrop;
const deleteCrop = (orgId, id) => {
    return prisma_1.prisma.crop.delete({ where: { id, orgId } });
};
exports.deleteCrop = deleteCrop;
