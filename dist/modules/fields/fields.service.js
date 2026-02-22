"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteField = exports.updateField = exports.createField = exports.listFields = void 0;
const prisma_1 = require("../../db/prisma");
const listFields = (orgId) => {
    return prisma_1.prisma.field.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
    });
};
exports.listFields = listFields;
const createField = (orgId, data) => {
    return prisma_1.prisma.field.create({
        data: {
            ...data,
            aliases: data.aliases ?? [],
            orgId,
        },
    });
};
exports.createField = createField;
const updateField = (orgId, id, data) => {
    return prisma_1.prisma.field.update({
        where: { id, orgId },
        data,
    });
};
exports.updateField = updateField;
const deleteField = (orgId, id) => {
    return prisma_1.prisma.field.delete({
        where: { id, orgId },
    });
};
exports.deleteField = deleteField;
