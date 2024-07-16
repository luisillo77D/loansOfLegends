import { Router } from "express";
import { getWeeklyPayments,registerWeeklyPayment } from "../controllers/weeklyPayment.controller.js";

const router = Router();

router.post("/register", registerWeeklyPayment);
router.get("/:loanId", getWeeklyPayments);

export default router;