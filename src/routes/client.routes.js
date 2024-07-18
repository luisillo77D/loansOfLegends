import { Router } from "express";
import { registerClient, getClients, getClientById, updateClientById,getLoansbyClient } from "../controllers/client.controller.js";

const router = Router();

router.post("/register", registerClient);
router.get("/", getClients);
router.get("/:clientId", getClientById);
router.put("/:clientId", updateClientById);
router.get("/:clientId/loans", getLoansbyClient);

export default router;