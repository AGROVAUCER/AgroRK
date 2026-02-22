"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const env = (0, env_1.loadEnv)();
const auth = (options = {}) => (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        if (options.optional)
            return next();
        return res.status(401).json({ message: "Missing Authorization header" });
    }
    const [, token] = header.split(" ");
    if (!token) {
        return res.status(401).json({ message: "Invalid Authorization header" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env.JWT_SECRET);
        req.user = payload;
        return next();
    }
    catch (err) {
        if (options.optional)
            return next();
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.auth = auth;
