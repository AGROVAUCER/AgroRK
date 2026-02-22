"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeField = exports.putField = exports.postField = exports.getFields = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const fields_service_1 = require("./fields.service");
exports.getFields = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const fields = await (0, fields_service_1.listFields)(req.orgId);
    res.json(fields);
});
exports.postField = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const field = await (0, fields_service_1.createField)(req.orgId, req.body);
    res.status(201).json(field);
});
exports.putField = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const field = await (0, fields_service_1.updateField)(req.orgId, req.params.id, req.body);
    res.json(field);
});
exports.removeField = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, fields_service_1.deleteField)(req.orgId, req.params.id);
    res.status(204).send();
});
