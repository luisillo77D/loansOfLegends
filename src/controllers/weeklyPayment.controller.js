import WeeklyPayment from "../models/weeklyPayment.model.js";
import Loan from "../models/loans.model.js";

// Create and Save a new Weekly Payment
export const registerWeeklyPayment = async (req, res) => {
  try {
    const { loanId, amountDue,payment } = req.body;

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

//metodo para asignar un pago a un pago semanal
export const payWeeklyPayment = async (req, res) => {
  try {
    const { weeklyPaymentId } = req.params;
    const { paymentDate, amountPaid } = req.body;
    //obtenemos el late fee si el pago se hizo despues de la fecha de pago, de 50 unidades por cada dia de retraso
    const weeklyPayment = await WeeklyPayment.findById(weeklyPaymentId);
    if (!weeklyPayment) return res.status(404).json({ message: "Weekly Payment not found" });
    let lateFee = 0;
    if (paymentDate > weeklyPayment.dueDate) {
      const daysLate = (paymentDate - weeklyPayment.dueDate) / (24 * 60 * 60 * 1000);
      lateFee = daysLate * 50;
    }
    
    weeklyPayment.payment = {
      paymentDate,
      amountPaid,
      lateFee,
    };
    await weeklyPayment.save();
    res.status(200).json(weeklyPayment);
  } catch (error) {
    console.error(error);
  }
};