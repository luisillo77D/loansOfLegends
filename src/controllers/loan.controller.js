import Loan from "../models/loans.model.js";
import WeeklyPayment from "../models/weeklyPayment.model.js";

// Create and Save a new Loan
export const registerLoan = async (req, res) => {
    try {
        const { clientId, amount, interestRate, total, guarantorId } = req.body;
        //asignamos la start date al domingo de la semana siguiente
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 7);
        const weeklyMount = total / 15;
        //asignamos la end date 15 semanas despues de la fecha de inicio
        const endDate = new Date(startDate.getTime() + 15 * 7 * 24 * 60 * 60 * 1000);
        console.log(endDate);
        // Create a Loan
        const loan = new Loan({
            client: clientId,
            amount,
            interest: interestRate,
            total,
            weeklyMount,
            guarantor: guarantorId,
            startDate,
            endDate
        });
        // Save Loan in the database
        const newLoan = await loan.save();
        // Save Weekly Payments in the database
        const weeklyPayments = [];
        for (let i = 1; i <= 15; i++) {
            const weeklyPayment = new WeeklyPayment({
                loan: newLoan._id,
                weekNumber: i,
                dueDate: new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000),
                amountDue: total / 15
            });
            weeklyPayments.push(weeklyPayment);
        }
        const WeeklyPayments = await WeeklyPayment.insertMany(weeklyPayments);
        console.log(WeeklyPayments);
        res.status(201).json(newLoan);
    } catch (error) {
        console.error(error);
    }
}

//metodo para obtener todos los prestamos activos
export const getActiveLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ paid: false });
        res.status(200).json(loans);
    } catch (error) {
        console.error(error);
    }
}

//metodo para obtener todos los prestamos
export const getLoans = async (req, res) => {
    try {
        const loans = await Loan.find();
        res.status(200).json(loans);
    } catch (error) {
        console.error(error);
    }
}

//metodo para obtener un prestamo por id
export const getLoanById = async (req, res) => {
    try {
        const { loanId } = req.params;
        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ message: "Loan not found" });
        res.status(200).json(loan);
    }
    catch (error) {
        console.error(error);
    }
}

//metodo para cambiar el estado de un prestamo a pagado
export const payLoan = async (req, res) => {
    try {
        const { loanId } = req.params;
        const loan = await Loan.findByIdAndUpdate(loanId, { paid: true }, { new: true });
        res.status(200).json(loan);
    }
    catch (error) {
        console.error(error);
    }
}

//metodo para obtener los pagos semanales de un prestamo
export const getWeeklyPayments = async (req, res) => {
    try {
        const { loanId } = req.params;
        const weeklyPayments = await WeeklyPayment.find({ loan: loanId, paid: false });
        res.status(200).json(weeklyPayments);
    }
    catch (error) {
        console.error(error);
    }
}