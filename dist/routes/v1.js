"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clients_routes_1 = __importDefault(require("../modules/clients/clients.routes"));
const crops_routes_1 = __importDefault(require("../modules/crops/crops.routes"));
const executors_routes_1 = __importDefault(require("../modules/executors/executors.routes"));
const fields_routes_1 = __importDefault(require("../modules/fields/fields.routes"));
const operations_routes_1 = __importDefault(require("../modules/operations/operations.routes"));
const router = (0, express_1.Router)();
router.use("/clients", clients_routes_1.default);
router.use("/crops", crops_routes_1.default);
router.use("/executors", executors_routes_1.default);
router.use("/fields", fields_routes_1.default);
router.use("/operations", operations_routes_1.default);
exports.default = router;
