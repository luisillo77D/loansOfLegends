import { Router } from "express";
import { registerLoan, getActiveLoans, getLoans,getLoanById,payLoan,getWeeklyPayments} from "../controllers/loan.controller.js";
import loanVerifications from "../middleware/registerLoan.middlewere.js";

const router = Router();

router.post("/register", loanVerifications, registerLoan);
router.get("/", getActiveLoans);
router.get("/all", getLoans);
router.get("/all/:loanId", getLoanById);
router.put("/pay/:loanId", payLoan);
router.get("/:loanId/payments/weekly", getWeeklyPayments);

export default router;