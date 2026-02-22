"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCrop = exports.putCrop = exports.postCrop = exports.getCrops = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const crops_service_1 = require("./crops.service");
exports.getCrops = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await (0, crops_service_1.listCrops)(req.orgId);
    res.json(data);
});
exports.postCrop = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const crop = await (0, crops_service_1.createCrop)(req.orgId, req.body);
    res.status(201).json(crop);
});
exports.putCrop = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const crop = await (0, crops_service_1.updateCrop)(req.orgId, req.params.id, req.body);
    res.json(crop);
});
exports.removeCrop = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, crops_service_1.deleteCrop)(req.orgId, req.params.id);
    res.status(204).send();
});
