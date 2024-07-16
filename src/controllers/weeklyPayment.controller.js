import WeeklyPayment from "../models/weeklyPayment.model.js";
import Loan from "../models/loans.model.js";

// Create and Save a new Weekly Payment
export const registerWeeklyPayment = async (req, res) => {
  try {
    const { loanId, amountDue } = req.body;

    // Get the last week number
    const lastWeeklyPayment = await WeeklyPayment.findOne
        .sort({ weekNumber: -1 })
        .limit(1);
    let weekNumber = 1;
    if (lastWeeklyPayment) {
      weekNumber = lastWeeklyPayment.weekNumber + 1;
    }
    //si el weekNumber es mayor a 15 no se puede registrar un nuevo pago
    if (weekNumber > 15) {
      return res.status(400).json({ message: "Loan already paid" });
    }
    //obtenemos la fecha para pagar con el weekNumber y la fecha de inicio del prestamo
    const loan = await Loan.findById(loanId);
    const startDate = loan.startDate;
    const dueDate = new Date(startDate.getTime() + weekNumber * 7 * 24 * 60 * 60 * 1000);
    // Create a Weekly Payment
    const weeklyPayment = new WeeklyPayment({
      loan: loanId,
      weekNumber,
      dueDate,
      amountDue,
    });
    // Save Weekly Payment in the database
    const newWeeklyPayment = await weeklyPayment.save();
    res.status(201).json(newWeeklyPayment);
  } catch (error) {
    console.error(error);
  }
};

//metodo para obtener todos los pagos semanales de un prestamo
export const getWeeklyPaymentsByLoanId = async (req, res) => {
  try {
    const { loanId } = req.params;
    const weeklyPayments = await WeeklyPayment.find({ loan: loanId });
    res.status(200).json(weeklyPayments);
  } catch (error) {
    console.error(error);
  }
};