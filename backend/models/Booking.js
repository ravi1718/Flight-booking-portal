const mongoose = require('mongoose');

const boardingPassSchema = new mongoose.Schema({
    pnr: { type: String, required: true },
    seatNumbers: [{ type: String }],
    gate: { type: String },
    terminal: { type: String },
    boardingTime: { type: Date },
    barcodeData: { type: String }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
    clerkUserId: { type: String, required: true, index: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    passengers: [{
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    boardingPass: { type: boardingPassSchema, default: null },
    stripePaymentIntentId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
