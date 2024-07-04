import mongoose from "mongoose";

const weeklyPaymentSchema = new mongoose.Schema({
    loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
        required: true,
    },
    weekNumber: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    amountDue: {
        type: Number,
        required: true,
    },
    payment:{
        paymentDate: {
            type: Date,
        },
        amountPaid: {
            type: Number,
        },
        lateFee: {
            type: Number,
        },
    }
    });

export default mongoose.model("WeeklyPayment", weeklyPaymentSchema);