"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOperationSchema = exports.createOperationSchema = void 0;
const zod_1 = require("zod");
exports.createOperationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        type: zod_1.z.string().min(1),
        aliases: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateOperationSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string() }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        type: zod_1.z.string().min(1).optional(),
        aliases: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
