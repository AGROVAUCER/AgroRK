"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.createClient = exports.listClients = void 0;
const prisma_1 = require("../../db/prisma");
const listClients = (orgId) => {
    return prisma_1.prisma.client.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } });
};
exports.listClients = listClients;
const createClient = (orgId, data) => {
    return prisma_1.prisma.client.create({
        data: {
            ...data,
            aliases: data.aliases ?? [],
            orgId,
        },
    });
};
exports.createClient = createClient;
const updateClient = (orgId, id, data) => {
    return prisma_1.prisma.client.update({ where: { id, orgId }, data });
};
exports.updateClient = updateClient;
const deleteClient = (orgId, id) => {
    return prisma_1.prisma.client.delete({ where: { id, orgId } });
};
exports.deleteClient = deleteClient;
