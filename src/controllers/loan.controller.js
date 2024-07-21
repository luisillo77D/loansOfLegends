import Loan from "../models/loans.model.js";
import WeeklyPayment from "../models/weeklyPayment.model.js";

// Create and Save a new Loan
export const registerLoan = async (req, res) => {
    try {
        const { clientId, amount, interestRate, total, guarantorId,loanType,startDate } = req.body;

        //asignamos la start date al domingo de la semana siguiente
        //const startDate = new Date();
        //startDate.setDate(startDate.getDate() - startDate.getDay() + 7);

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
            endDate,
            loanType
        });
        // Save Loan in the database
        const newLoan = await loan.save();
        res.status(201).json(newLoan);
    } catch (error) {
        console.error(error);
    }
}

//metodo para obtener todos los prestamos activos
export const getActiveLoans = async (req, res) => {
    try {
        //regresamos loas prestamos pero en lugar de regresar el id del cliente regresamos el nombre del cliente y apellido
        const loans = await Loan.find({ paid: false }).populate("client", "name lastname").populate("guarantor", "name lastname");
        res.status(200).json(loans);
    } catch (error) {
        console.error(error);
    }
}

//metodo para obtener todos los prestamos
export const getLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate("client", "name lastname").populate("guarantor", "name lastname");
        res.status(200).json(loans);
    } catch (error) {
        console.error(error);
    }
}

//metodo para obtener un prestamo por id
export const getLoanById = async (req, res) => {
    try {
        const { loanId } = req.params;
        const loan = await Loan.findById(loanId).populate("client", "name lastname").populate("guarantor", "name lastname");
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

export const getLoansbyType = async (req, res) => {
    try {
        const { loanType } = req.params;
        const loans = await Loan.find({ loanType: loanType }).populate("client", "name lastname").populate("guarantor", "name lastname");
        res.status(200).json(loans);
    }
    catch (error) {
        console.error(error);
    }
}

//obtenemos los prestamos de un cliente por id
export const getLoansbyClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const loans = await Loan.find({ client: clientId }).populate("client", "name lastname").populate("guarantor", "name lastname");
        if (!loans) return res.status(404).json({ message: "Loans not found" });
        res.status(200).json(loans);
    }
    catch (error) {
        console.error(error);
    }
}