import { Router } from "express";
import clientsRouter from "../modules/clients/clients.routes";
import cropsRouter from "../modules/crops/crops.routes";
import executorsRouter from "../modules/executors/executors.routes";
import fieldsRouter from "../modules/fields/fields.routes";
import operationsRouter from "../modules/operations/operations.routes";

const router = Router();

router.use("/clients", clientsRouter);
router.use("/crops", cropsRouter);
router.use("/executors", executorsRouter);
router.use("/fields", fieldsRouter);
router.use("/operations", operationsRouter);

export default router;
