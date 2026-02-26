// routes/v1.ts
import { Router } from "express";

import authRouter from "../modules/auth/auth.routes";
import adminRouter from "../modules/admin/admin.routes";

import clientsRouter from "../modules/clients/clients.routes";
import cropsRouter from "../modules/crops/crops.routes";
import executorsRouter from "../modules/executors/executors.routes";
import fieldsRouter from "../modules/fields/fields.routes";
import operationsRouter from "../modules/operations/operations.routes";
import usersRouter from "../modules/users/users.routes";
import entriesRouter from "../modules/entries/entries.routes";
import adminUsersRouter from "../modules/admin/admin.users.routes";

import { auth } from "../middleware/auth";
import { orgScope } from "../middleware/orgScope";

const router = Router();

router.use("/auth", authRouter);

// admin endpoints: auth only (no orgScope)
router.use("/admin", adminRouter);

// all other v1 routes require auth + orgScope
router.use(auth(), orgScope);

router.use("/users", usersRouter);
router.use("/clients", clientsRouter);
router.use("/crops", cropsRouter);
router.use("/executors", executorsRouter);
router.use("/fields", fieldsRouter);
router.use("/operations", operationsRouter);
router.use("/entries", entriesRouter);
router.use("/admin", adminUsersRouter);
export default router;