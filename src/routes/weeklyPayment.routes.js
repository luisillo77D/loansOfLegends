import { Router } from "express";
import { getWeeklyPaymentsByLoanId,registerWeeklyPayment,payWeeklyPayment } from "../controllers/weeklyPayment.controller.js";

const router = Router();

router.post("/register", registerWeeklyPayment);
router.get("/:loanId", getWeeklyPaymentsByLoanId);
router.put("/:weeklyPaymentId/pay", payWeeklyPayment);

export default router;