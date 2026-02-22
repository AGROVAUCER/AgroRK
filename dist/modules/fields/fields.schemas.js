"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFieldSchema = exports.createFieldSchema = void 0;
const zod_1 = require("zod");
exports.createFieldSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        area: zod_1.z.number().positive(),
        unit: zod_1.z.string().min(1),
        aliases: zod_1.z.array(zod_1.z.string()).optional(),
        currentCropId: zod_1.z.string().optional(),
    }),
});
exports.updateFieldSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        area: zod_1.z.number().positive().optional(),
        unit: zod_1.z.string().min(1).optional(),
        aliases: zod_1.z.array(zod_1.z.string()).optional(),
        currentCropId: zod_1.z.string().optional().nullable(),
    }),
});
