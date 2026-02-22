"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeClient = exports.putClient = exports.postClient = exports.getClients = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const clients_service_1 = require("./clients.service");
exports.getClients = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, clients_service_1.listClients)(req.orgId);
    res.json(data);
});
exports.postClient = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const client = await (0, clients_service_1.createClient)(req.orgId, req.body);
    res.status(201).json(client);
});
exports.putClient = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const client = await (0, clients_service_1.updateClient)(req.orgId, req.params.id, req.body);
    res.json(client);
});
exports.removeClient = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, clients_service_1.deleteClient)(req.orgId, req.params.id);
    res.status(204).send();
});
