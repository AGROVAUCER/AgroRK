"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = require("./config/cors");
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const v1_1 = __importDefault(require("./routes/v1"));
const legacy_1 = require("./routes/legacy");
const env = (0, env_1.loadEnv)();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors_1.corsMiddleware);
app.use((0, morgan_1.default)("dev"));
// API versions
app.use("/v1", v1_1.default);
// Legacy compatibility for existing frontend (supabase function paths)
app.use("/make-server-628f7fac", legacy_1.legacyRouter);
// Health root
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
});
exports.default = app;
