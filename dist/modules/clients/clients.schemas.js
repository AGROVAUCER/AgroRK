"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClientSchema = exports.createClientSchema = void 0;
const zod_1 = require("zod");
exports.createClientSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        phone: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        aliases: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateClientSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string() }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        phone: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        aliases: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
