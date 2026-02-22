"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgScope = void 0;
const orgScope = (req, _res, next) => {
    const orgId = req.user?.orgId || req.headers["x-org-id"] || "default-org";
    req.orgId = orgId;
    next();
};
exports.orgScope = orgScope;
