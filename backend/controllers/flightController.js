const Flight = require('../models/Flight');

const seedFlights = async (req, res) => {
    try {
        const count = await Flight.countDocuments();
        if (count === 0) {
            const flights = [
                { airline: 'Emirates', flightNumber: 'EK500', from: 'New York', to: 'London', departureTime: new Date(Date.now() + 86400000), arrivalTime: new Date(Date.now() + 115200000), price: 850, duration: '8h 00m' },
                { airline: 'Qatar Airways', flightNumber: 'QR201', from: 'Dubai', to: 'New York', departureTime: new Date(Date.now() + 172800000), arrivalTime: new Date(Date.now() + 223200000), price: 1200, duration: '14h 00m' },
                { airline: 'Singapore Airlines', flightNumber: 'SQ32', from: 'Singapore', to: 'San Francisco', departureTime: new Date(Date.now() + 259200000), arrivalTime: new Date(Date.now() + 316800000), price: 950, duration: '16h 00m' },
                { airline: 'British Airways', flightNumber: 'BA117', from: 'London', to: 'New York', departureTime: new Date(Date.now() + 345600000), arrivalTime: new Date(Date.now() + 374400000), price: 700, duration: '8h 00m' }
            ];
            await Flight.insertMany(flights);
            res.json({ message: 'Flights seeded successfully' });
        } else {
            res.json({ message: 'Flights already exist' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFlights = async (req, res) => {
    const { from, to, date } = req.query;
    try {
        let query = {};
        if (from) query.from = new RegExp(`^${from}$`, 'i');
        if (to) query.to = new RegExp(`^${to}$`, 'i');
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.departureTime = { $gte: startOfDay, $lte: endOfDay };
        }
        
        // If no queries provided, we just return all flights for display purposes
        const flights = await Flight.find(query);
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (flight) {
            res.json(flight);
        } else {
            res.status(404).json({ message: 'Flight not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFlights, getFlightById, seedFlights };
