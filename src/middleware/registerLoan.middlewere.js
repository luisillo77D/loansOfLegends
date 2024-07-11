// VerificationsMiddleware.js
import Client from "../models/client.model.js";
import Loan from "../models/loans.model.js";

const loanVerifications = async (req, res, next) => {
    try {
        const { clientId, guarantorId } = req.body;

        const client = await Client.findById(clientId);
        if (!client) return res.status(404).json({ message: "Client not found" });

        const guarantor = await Client.findById(guarantorId);
        if (!guarantor) return res.status(404).json({ message: "Guarantor not found" });

        const activeLoan = await Loan.findOne({ client: clientId, paid: false });
        if (activeLoan) return res.status(400).json({ message: "Client already has an active loan" });

        const guarantorLoan = await Loan.findOne({ guarantor: guarantorId, paid: false });
        if (guarantorLoan) return res.status(400).json({ message: "Guarantor is already a guarantor in another loan" });

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default loanVerifications;