import { Router } from "express";
import { auth } from "../../middleware/auth";
import { orgScope } from "../../middleware/orgScope";
import { validate } from "../../utils/validate";
import { createClientSchema, updateClientSchema } from "./clients.schemas";
import { getClients, postClient, putClient, removeClient } from "./clients.controller";

const router = Router();

router.use(auth({ optional: true }), orgScope);

router.get("/", getClients);
router.post("/", validate(createClientSchema), postClient);
router.put("/:id", validate(updateClientSchema), putClient);
router.delete("/:id", removeClient);

export default router;
