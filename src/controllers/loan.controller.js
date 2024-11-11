import Loan from "../models/loans.model.js";
import WeeklyPayment from "../models/weeklyPayment.model.js";

// Create and Save a new Loan
const verifyActiveLoan = async (client,type) => {
    //buscamos si hay un prestamo activo del mismo tipo para el mismo cliente 
    const activeLoan = await Loan.find({ client: client, loanType: type, paid: false });
    if (activeLoan != null && activeLoan.length > 0) {
        return true;
    }
    return false;
}

export const registerLoan = async (req, res) => {
    try {
        const { client, amount, guarantor,type,startDate } = req.body;

        //asignamos la start date al domingo de la semana siguiente
        //const startDate = new Date();
        //startDate.setDate(startDate.getDate() - startDate.getDay() + 7);
        //calculamos el total del prestamo

        //verificamos si el cliente tiene un prestamo activo del mismo tipo
        const hasActiveLoan = await verifyActiveLoan(client, type);
        if (hasActiveLoan) {
            return res.status(402).json({ message: "The client already has an active loan of the same type" });
        } 

       //lee la fecha en formato yyyy-mm-dd y la convierte a un objeto Date
        const startDateF = new Date(startDate);
        startDateF.setDate(startDateF.getDate() - startDateF.getDay() + 7);
        
        const weeklyMount = amount / 15;
        //asignamos la end date 15 semanas despues de la fecha de inicio
        const endDate = new Date(startDateF.getTime() + 15 * 7 * 24 * 60 * 60 * 1000);
        console.log(endDate);
        // Create a Loan
        const loan = new Loan({
            client,
            amount,
            weeklyMount,
            guarantor,
            startDate: startDateF,
            endDate,
            loanType: type,
        });
        // Save Loan in the database
        const newLoan = await loan.save();
        //creamos los pagos semanales para las 15 semanas
        for (let i = 0; i < 15; i++) {
            const weeklyPayment = new WeeklyPayment({
                loan: newLoan._id,
                week: i + 1,
                amountDue: weeklyMount,
                dueDate: new Date(startDateF.getTime() + i * 7 * 24 * 60 * 60 * 1000),
                weekNumber: i + 1,
            });
            await weeklyPayment.save();
        }
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
        const  loanType  = req.params.loanType;
        //filtramos los prestamos por tipo
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