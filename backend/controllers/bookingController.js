const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

const createBooking = async (req, res) => {
    const { flightId, passengers, totalAmount } = req.body;
    try {
        const flight = await Flight.findById(flightId);
        if (!flight) return res.status(404).json({ message: 'Flight not found' });

        const booking = new Booking({
            user: req.user._id,
            flight: flightId,
            passengers,
            totalAmount,
            paymentStatus: 'Pending'
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('flight');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('flight');
        if (booking && booking.user.toString() === req.user._id.toString()) {
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBookingToPaid = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.paymentStatus = 'Paid';
            booking.stripePaymentIntentId = req.body.paymentIntentId;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getBookingById, updateBookingToPaid };
