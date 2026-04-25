const Flight = require('../models/Flight');
const { AIRLINE_MAP, ROUTE_MAP, CABIN_CLASSES } = require('../config/routeData');

// Seed 1-2 days in advance to get consistent flight numbers
const FLIGHT_NUMBER_SEEDS = {
    '6E': 200, 'AI': 400, 'SG': 600, 'UK': 800,
    'I5': 300, 'QP': 500, 'IX': 700,
};

function minsToDisplay(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Add slight price variation per airline, date, and cabin so results feel dynamic
function calcPrice(basePrice, airlineMultiplier, cabinMultiplier, dateStr, slotIndex) {
    // Date-based surge: bookings closer to departure cost more
    const today = new Date();
    const depDate = new Date(dateStr);
    const daysAway = Math.max(0, Math.floor((depDate - today) / 86400000));
    let surge = 1.0;
    if (daysAway <= 1)  surge = 1.45;
    else if (daysAway <= 3)  surge = 1.30;
    else if (daysAway <= 7)  surge = 1.15;
    else if (daysAway <= 14) surge = 1.05;

    // Small slot-based variance so flights aren't all the same price
    const slotVariance = 1 + (slotIndex % 5) * 0.03;

    const raw = basePrice * airlineMultiplier * cabinMultiplier * surge * slotVariance;
    return Math.round(raw / 50) * 50; // Round to nearest ₹50
}

// Generate flight objects for a given route + date, upsert to DB, return DB records
async function generateAndUpsert(routeKey, dateStr) {
    const route = ROUTE_MAP[routeKey];
    if (!route) return [];

    const upserted = [];

    // Determine which cabin classes to generate (not every flight has all classes)
    // Economy always present. Business on ~60% of flights. First Class on ~20%.
    const classDice = [0, 0, 0, 1, 1, 2]; // 3 Economy, 2 Business, 1 First

    let globalSlot = 0;
    for (const airlineCode of route.airlines) {
        const airline = AIRLINE_MAP[airlineCode];
        const baseFlightNum = FLIGHT_NUMBER_SEEDS[airlineCode] || 100;

        for (let t = 0; t < route.flightTimes.length; t++) {
            // Not every airline operates every slot — stagger them
            const operatesThisSlot = (
                (route.airlines.indexOf(airlineCode) + t) % Math.max(2, Math.floor(route.airlines.length / 2)) === 0
                || route.airlines.length <= 2
            );
            if (!operatesThisSlot && route.flightTimes.length > 4) continue;

            const depHour = route.flightTimes[t];
            const depMin = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][globalSlot % 12];
            const flightNumber = `${airlineCode}-${baseFlightNum + t * 3 + route.airlines.indexOf(airlineCode)}`;

            const depDate = new Date(dateStr);
            depDate.setHours(depHour, depMin, 0, 0);
            const arrDate = new Date(depDate.getTime() + route.durationMins * 60000);

            // Pick a cabin class for this flight variant
            const cabinConfig = CABIN_CLASSES[classDice[globalSlot % classDice.length]];
            const price = calcPrice(
                route.basePrice,
                airline.baseMultiplier,
                cabinConfig.priceMultiplier,
                dateStr,
                globalSlot
            );
            const seatsAvailable = cabinConfig.seats[globalSlot % cabinConfig.seats.length];

            const doc = {
                airline: airline.name,
                airlineCode: airline.code,
                logo: airline.logo,
                flightNumber,
                from: route.from,
                to: route.to,
                departureTime: depDate,
                arrivalTime: arrDate,
                price,
                duration: minsToDisplay(route.durationMins),
                durationMins: route.durationMins,
                stops: 0,
                seatsAvailable,
                class: cabinConfig.name,
                amenities: cabinConfig.amenities,
                cachedAt: new Date()
            };

            await Flight.updateOne(
                { flightNumber, departureTime: depDate },
                { $set: doc },
                { upsert: true }
            );

            globalSlot++;
        }
    }

    return [];
}

// GET /api/flights?from=DEL&to=BOM&date=2026-05-01
const searchFlights = async (req, res) => {
    const { from, to, date } = req.query;
    if (!from || !to || !date) {
        return res.status(400).json({ message: 'from, to, and date are required' });
    }

    const fromCode = from.toUpperCase();
    const toCode = to.toUpperCase();
    const routeKey = `${fromCode}-${toCode}`;

    if (!ROUTE_MAP[routeKey]) {
        return res.json([]); // Route not in database
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        // Serve from cache if < 30 min old
        const cacheThreshold = new Date(Date.now() - 30 * 60 * 1000);
        const cached = await Flight.find({
            from: fromCode,
            to: toCode,
            departureTime: { $gte: startOfDay, $lte: endOfDay },
            cachedAt: { $gte: cacheThreshold }
        }).lean();

        if (cached.length > 0) {
            return res.json(cached);
        }

        // Generate and upsert flights for this route + date
        await generateAndUpsert(routeKey, date);

        const results = await Flight.find({
            from: fromCode,
            to: toCode,
            departureTime: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ departureTime: 1 }).lean();

        res.json(results);
    } catch (err) {
        console.error('searchFlights error:', err);
        res.status(500).json({ message: 'Server error while searching flights' });
    }
};

// GET /api/flights/:id
const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Flight not found' });
        res.json(flight);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/flights/seed — seeds all routes for next 3 days (useful for demo)
const seedFlights = async (req, res) => {
    try {
        const { ROUTES } = require('../config/routeData');
        const days = [0, 1, 2, 3, 4, 5, 6]; // seed for next 7 days
        let total = 0;

        for (const day of days) {
            const d = new Date();
            d.setDate(d.getDate() + day);
            const dateStr = d.toISOString().split('T')[0];

            for (const route of ROUTES) {
                const key = `${route.from}-${route.to}`;
                await generateAndUpsert(key, dateStr);
            }
        }

        const count = await Flight.countDocuments();
        res.json({ message: `Routes seeded for next 7 days. Total flights in DB: ${count}` });
    } catch (err) {
        console.error('Seed error:', err);
        res.status(500).json({ message: 'Seed failed', error: err.message });
    }
};

module.exports = { searchFlights, getFlightById, seedFlights };
