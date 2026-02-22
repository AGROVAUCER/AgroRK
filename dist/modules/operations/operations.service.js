"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOperation = exports.updateOperation = exports.createOperation = exports.listOperations = void 0;
const prisma_1 = require("../../db/prisma");
const listOperations = (orgId) => {
    return prisma_1.prisma.operation.findMany({ where: { orgId }, orderBy: { name: "asc" } });
};
exports.listOperations = listOperations;
const createOperation = (orgId, data) => {
    return prisma_1.prisma.operation.create({
        data: { ...data, aliases: data.aliases ?? [], orgId },
    });
};
exports.createOperation = createOperation;
const updateOperation = (orgId, id, data) => {
    return prisma_1.prisma.operation.update({ where: { id, orgId }, data });
};
exports.updateOperation = updateOperation;
const deleteOperation = (orgId, id) => {
    return prisma_1.prisma.operation.delete({ where: { id, orgId } });
};
exports.deleteOperation = deleteOperation;
