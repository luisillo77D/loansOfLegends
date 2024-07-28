import { Router } from "express";
import { getWeeklyPaymentsByLoanId,payWeeklyPayment } from "../controllers/weeklyPayment.controller.js";

const router = Router();

router.get("/:loanId", getWeeklyPaymentsByLoanId);
router.put("/:weeklyPaymentId/pay", payWeeklyPayment);

export default router;