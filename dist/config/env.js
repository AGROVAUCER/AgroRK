"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
const z = __importStar(require("zod"));
const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().default("file:./dev.db"),
    JWT_SECRET: z.string().default("super-secret-key"),
    SUPERADMIN_EMAIL: z.string().email().default("admin@agro.local"),
    SUPERADMIN_PASSWORD: z.string().default("admin123"),
});
let cachedEnv = null;
const loadEnv = () => {
    if (cachedEnv)
        return cachedEnv;
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error("Invalid environment configuration", parsed.error.flatten());
        throw new Error("Invalid environment variables");
    }
    cachedEnv = parsed.data;
    return cachedEnv;
};
exports.loadEnv = loadEnv;
