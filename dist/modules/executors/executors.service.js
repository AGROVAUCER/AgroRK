"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExecutor = exports.updateExecutor = exports.createExecutor = exports.listExecutors = void 0;
const prisma_1 = require("../../db/prisma");
const listExecutors = (orgId) => {
    return prisma_1.prisma.executor.findMany({ where: { orgId }, orderBy: { name: "asc" } });
};
exports.listExecutors = listExecutors;
const createExecutor = (orgId, data) => {
    return prisma_1.prisma.executor.create({ data: { ...data, aliases: data.aliases ?? [], orgId } });
};
exports.createExecutor = createExecutor;
const updateExecutor = (orgId, id, data) => {
    return prisma_1.prisma.executor.update({ where: { id, orgId }, data });
};
exports.updateExecutor = updateExecutor;
const deleteExecutor = (orgId, id) => {
    return prisma_1.prisma.executor.delete({ where: { id, orgId } });
};
exports.deleteExecutor = deleteExecutor;
