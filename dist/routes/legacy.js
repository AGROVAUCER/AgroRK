"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyRouter = void 0;
const express_1 = require("express");
/**
 * Minimal legacy router used to keep compatibility with older Supabase function paths.
 * For now it just responds with a health payload.
 */
const router = (0, express_1.Router)();
router.all("*", (_req, res) => {
    res.json({ status: "ok", legacy: true });
});
exports.legacyRouter = router;
