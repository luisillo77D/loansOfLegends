import { Router } from "express";
import { registerLoan, getActiveLoans, getLoans} from "../controllers/loan.controller.js";
import loanVerifications from "../middleware/registerLoan.middlewere.js";

const router = Router();

router.post("/register", loanVerifications, registerLoan);
router.get("/", getActiveLoans);
router.get("/all", getLoans);

export default router;