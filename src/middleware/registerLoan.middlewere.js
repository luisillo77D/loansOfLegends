// VerificationsMiddleware.js
import Client from "../models/client.model.js";
import Loan from "../models/loans.model.js";

const loanVerifications = async (req, res, next) => {
    try {
        const { client, guarantor } = req.body;

        const clientV = await Client.findById(client);
        if (!clientV) return res.status(404).json({ message: "Client not found" });

        const guarantorV = await Client.findById(guarantor);
        if (!guarantorV) return res.status(400).json({ message: "Guarantor not found" });

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default loanVerifications;