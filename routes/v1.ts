import { Router } from "express";
import clientsRouter from "../modules/clients/clients.routes";
import cropsRouter from "../modules/crops/crops.routes";
import executorsRouter from "../modules/executors/executors.routes";
import fieldsRouter from "../modules/fields/fields.routes";
import operationsRouter from "../modules/operations/operations.routes";
import authRouter from "../modules/auth/auth.routes";
import usersRouter from "../modules/users/users.routes";
import entriesRouter from "../modules/entries/entries.routes";
import { auth } from "../middleware/auth";
import { orgScope } from "../middleware/orgScope";

const router = Router();

router.use("/auth", authRouter); // login and me

// all other v1 routes require auth
router.use(auth(), orgScope);

router.use("/users", usersRouter);
router.use("/clients", clientsRouter);
router.use("/crops", cropsRouter);
router.use("/executors", executorsRouter);
router.use("/fields", fieldsRouter);
router.use("/operations", operationsRouter);
router.use("/entries", entriesRouter);

export default router;
