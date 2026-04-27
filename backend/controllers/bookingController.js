const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { generatePNR, assignSeats } = require('../utils/helpers');

const GATES = ['A1','A2','A3','A4','A5','B1','B2','B3','B4','B5','B6','B7','C1','C2','C3','D1','D2'];
const TERMINALS = ['T1', 'T2', 'T3'];

const createBooking = async (req, res) => {
    const { flightId, passengers, totalAmount } = req.body;

    if (!flightId || !passengers?.length || !totalAmount) {
        return res.status(400).json({ message: 'flightId, passengers, and totalAmount are required' });
    }

    try {
        const flight = await Flight.findById(flightId);
        if (!flight) return res.status(404).json({ message: 'Flight not found' });

        if (flight.seatsAvailable < passengers.length) {
            return res.status(400).json({
                message: `Only ${flight.seatsAvailable} seat(s) available for this flight`
            });
        }

        const booking = new Booking({
            clerkUserId: req.auth.userId,
            flight: flightId,
            passengers,
            totalAmount,
            paymentStatus: 'Pending'
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        console.error('createBooking error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ clerkUserId: req.auth.userId })
            .populate('flight')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('flight');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.clerkUserId !== req.auth.userId) {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const confirmBookingPayment = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('flight');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.clerkUserId !== req.auth.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.paymentStatus === 'Paid') {
            return res.status(400).json({ message: 'Booking already paid' });
        }

        const flight = booking.flight;
        const passengerCount = booking.passengers.length;
        const { addOns } = req.body;

        // Apply add-ons: update passenger meal preferences + recalculate total
        if (addOns) {
            let addOnsTotal = 0;

            if (addOns.meals?.length) {
                addOns.meals.forEach(m => {
                    addOnsTotal += (m.price || 0);
                    if (booking.passengers[m.passengerIndex]) {
                        booking.passengers[m.passengerIndex].mealPreference = m.type || 'No Meal';
                    }
                });
            }
            if (addOns.extraBaggage?.price) addOnsTotal += addOns.extraBaggage.price;
            if (addOns.insurance?.price)    addOnsTotal += addOns.insurance.price;
            if (addOns.priorityBoarding?.price) addOnsTotal += addOns.priorityBoarding.price;
            if (addOns.seatUpgrade?.price)  addOnsTotal += addOns.seatUpgrade.price;

            booking.totalAmount += addOnsTotal;
            booking.addOns = addOns;
        }

        // Generate boarding pass
        const pnr = generatePNR();
        const seatNumbers = await assignSeats(flight, passengerCount);
        const gate = GATES[Math.floor(Math.random() * GATES.length)];
        const terminal = TERMINALS[Math.floor(Math.random() * TERMINALS.length)];
        const boardingTime = new Date(flight.departureTime.getTime() - 45 * 60 * 1000);
        const barcodeData = `${pnr}|${flight.flightNumber}|${flight.from}|${flight.to}`;

        // Atomically decrement available seats
        await Flight.findByIdAndUpdate(flight._id, {
            $inc: { seatsAvailable: -passengerCount }
        });

        booking.paymentStatus = 'Paid';
        booking.boardingPass = { pnr, seatNumbers, gate, terminal, boardingTime, barcodeData };
        const updatedBooking = await booking.save();

        await updatedBooking.populate('flight');
        res.json(updatedBooking);
    } catch (error) {
        console.error('confirmBookingPayment error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getBookingById, confirmBookingPayment };
