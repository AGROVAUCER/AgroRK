"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExecutor = exports.putExecutor = exports.postExecutor = exports.getExecutors = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const executors_service_1 = require("./executors.service");
exports.getExecutors = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, executors_service_1.listExecutors)(req.orgId);
    res.json(data);
});
exports.postExecutor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const executor = await (0, executors_service_1.createExecutor)(req.orgId, req.body);
    res.status(201).json(executor);
});
exports.putExecutor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const executor = await (0, executors_service_1.updateExecutor)(req.orgId, req.params.id, req.body);
    res.json(executor);
});
exports.removeExecutor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, executors_service_1.deleteExecutor)(req.orgId, req.params.id);
    res.status(204).send();
});
