"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOperation = exports.putOperation = exports.postOperation = exports.getOperations = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const operations_service_1 = require("./operations.service");
exports.getOperations = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, operations_service_1.listOperations)(req.orgId);
    res.json(data);
});
exports.postOperation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const op = await (0, operations_service_1.createOperation)(req.orgId, req.body);
    res.status(201).json(op);
});
exports.putOperation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const op = await (0, operations_service_1.updateOperation)(req.orgId, req.params.id, req.body);
    res.json(op);
});
exports.removeOperation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, operations_service_1.deleteOperation)(req.orgId, req.params.id);
    res.status(204).send();
});
