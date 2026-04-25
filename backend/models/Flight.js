const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: { type: String, required: true },
    airlineCode: { type: String, required: true, default: 'XX' },
    logo: { type: String, default: '' },
    flightNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    durationMins: { type: Number, default: 0 },
    stops: { type: Number, default: 0 },
    seatsAvailable: { type: Number, default: 180 },
    class: {
        type: String,
        enum: ['Economy', 'Business', 'First Class'],
        default: 'Economy'
    },
    amenities: [{ type: String }],
    // Internal seat assignment state
    lastSeatRow: { type: Number, default: 10 },
    lastSeatCol: { type: Number, default: 0 },
    // Caching metadata
    cachedAt: { type: Date, default: Date.now },
    amadeusOfferId: { type: String }
}, { timestamps: true });

// Unique index to enable safe upsert caching
flightSchema.index({ flightNumber: 1, departureTime: 1 }, { unique: true });

module.exports = mongoose.model('Flight', flightSchema);
