import Loan from "../models/loans.model.js";
import WeeklyPayment from "../models/weeklyPayment.model.js";

// Create and Save a new Loan
export const registerLoan = async (req, res) => {
    try {
        const { clientId, amount, interestRate, total, guarantorId } = req.body;
        //asignamos la start date al domingo de la semana siguiente
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 7);
        console.log(startDate);
        //asignamos la end date 15 semanas despues de la fecha de inicio
        const endDate = new Date(startDate.getTime() + 15 * 7 * 24 * 60 * 60 * 1000);
        console.log(endDate);
        // Create a Loan
        const loan = new Loan({
            client: clientId,
            amount,
            interest: interestRate,
            total,
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
