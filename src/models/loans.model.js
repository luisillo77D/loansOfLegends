import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    weeklyMount: {
        type: Number,
        required: true,
    },
    paid: {
        type: Boolean,
        default: false,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        // 15 weeks from the start date
        default: () => {
            const startDate = new Date();
            return startDate.setDate(startDate.getDate() + 15 * 7);
        },
    },
    guarantor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    loanType: {
        type: String,
        required: true,
    },
    
    });

export default mongoose.model("Loan", loanSchema);