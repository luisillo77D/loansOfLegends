import { Router } from "express";
import { registerLoan, getActiveLoans, getLoans,getLoanById,payLoan,getWeeklyPayments,getLoansbyType,getLoansbyClient} from "../controllers/loan.controller.js";
import loanVerifications from "../middleware/registerLoan.middlewere.js";

const router = Router();

router.post("/", loanVerifications, registerLoan);
router.get("/", getActiveLoans);
router.get("/all", getLoans);
router.get("/:loanId", getLoanById);
router.put("/pay/:loanId", payLoan);
router.get("/:loanId/payments/", getWeeklyPayments);
router.get("/type/:loanType", getLoansbyType);
router.get("/:clientId/loans", getLoansbyClient);

export default router;