"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    const details = err.details;
    console.error("Error:", err);
    res.status(status).json({ message, details });
};
exports.errorHandler = errorHandler;
