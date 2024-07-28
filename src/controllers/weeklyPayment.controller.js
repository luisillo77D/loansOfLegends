import WeeklyPayment from "../models/weeklyPayment.model.js";
import Loan from "../models/loans.model.js";

//metodo para obtener todos los pagos semanales de un prestamo
export const getWeeklyPaymentsByLoanId = async (req, res) => {
  try {
    const { loanId } = req.params;
    const weeklyPayments = await WeeklyPayment.find({ loan: loanId }).populate({
      path: 'loan',
      populate: {
          path: 'client',
          select: 'name lastname' // Selecciona solo el campo 'name' del cliente
      }
  });    res.status(200).json(weeklyPayments);
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