// Real airline routes with scheduled departure times and base prices
// Domestic: IndiGo (6E), Air India (AI), SpiceJet (SG), Vistara (UK),
//           AirAsia India (I5), Akasa Air (QP), Air India Express (IX)
// International: Emirates (EK), Etihad (EY), British Airways (BA),
//                Singapore Airlines (SQ), Qatar Airways (QR)

const AIRLINES = [
    { code: '6E', name: 'IndiGo',             logo: '🔵', baseMultiplier: 1.0  },
    { code: 'AI', name: 'Air India',           logo: '🔴', baseMultiplier: 1.25 },
    { code: 'SG', name: 'SpiceJet',            logo: '🟠', baseMultiplier: 0.90 },
    { code: 'UK', name: 'Vistara',             logo: '🟣', baseMultiplier: 1.35 },
    { code: 'I5', name: 'AirAsia India',       logo: '🟥', baseMultiplier: 0.85 },
    { code: 'QP', name: 'Akasa Air',           logo: '🟡', baseMultiplier: 0.92 },
    { code: 'IX', name: 'Air India Express',   logo: '🔶', baseMultiplier: 0.95 },
    { code: 'EK', name: 'Emirates',            logo: '🇦🇪', baseMultiplier: 1.80 },
    { code: 'EY', name: 'Etihad Airways',      logo: '🌙', baseMultiplier: 1.70 },
    { code: 'BA', name: 'British Airways',     logo: '🇬🇧', baseMultiplier: 1.90 },
    { code: 'SQ', name: 'Singapore Airlines',  logo: '🦁', baseMultiplier: 2.00 },
    { code: 'QR', name: 'Qatar Airways',       logo: '🇶🇦', baseMultiplier: 1.85 },
];

// Each route: { from, to, durationMins, basePrice (Economy INR), flightTimes[] }
// flightTimes: departure hours (24h) — represents actual scheduled slots
const ROUTES = [
    // DEL ↔ BOM (Delhi ↔ Mumbai) — busiest corridor
    {
        from: 'DEL', to: 'BOM', durationMins: 130, basePrice: 4200,
        airlines: ['6E','AI','SG','UK','I5','QP'],
        flightTimes: [5, 6, 7, 8, 9, 10, 12, 14, 16, 17, 18, 19, 20, 21, 22]
    },
    {
        from: 'BOM', to: 'DEL', durationMins: 130, basePrice: 4200,
        airlines: ['6E','AI','SG','UK','I5','QP'],
        flightTimes: [5, 6, 7, 8, 9, 10, 12, 14, 16, 17, 18, 19, 20, 21, 22]
    },
    // DEL ↔ BLR (Delhi ↔ Bangalore)
    {
        from: 'DEL', to: 'BLR', durationMins: 160, basePrice: 4800,
        airlines: ['6E','AI','UK','SG','I5'],
        flightTimes: [5, 6, 8, 10, 13, 16, 18, 20, 22]
    },
    {
        from: 'BLR', to: 'DEL', durationMins: 160, basePrice: 4800,
        airlines: ['6E','AI','UK','SG','I5'],
        flightTimes: [5, 6, 8, 10, 13, 16, 18, 20, 22]
    },
    // DEL ↔ HYD (Delhi ↔ Hyderabad)
    {
        from: 'DEL', to: 'HYD', durationMins: 150, basePrice: 4500,
        airlines: ['6E','AI','SG','UK','QP'],
        flightTimes: [6, 8, 10, 13, 16, 19, 21]
    },
    {
        from: 'HYD', to: 'DEL', durationMins: 150, basePrice: 4500,
        airlines: ['6E','AI','SG','UK','QP'],
        flightTimes: [6, 8, 10, 13, 16, 19, 21]
    },
    // DEL ↔ MAA (Delhi ↔ Chennai)
    {
        from: 'DEL', to: 'MAA', durationMins: 165, basePrice: 5100,
        airlines: ['6E','AI','SG','UK'],
        flightTimes: [6, 8, 11, 15, 19, 22]
    },
    {
        from: 'MAA', to: 'DEL', durationMins: 165, basePrice: 5100,
        airlines: ['6E','AI','SG','UK'],
        flightTimes: [5, 7, 10, 14, 18, 21]
    },
    // DEL ↔ CCU (Delhi ↔ Kolkata)
    {
        from: 'DEL', to: 'CCU', durationMins: 140, basePrice: 4600,
        airlines: ['6E','AI','SG','UK','I5'],
        flightTimes: [6, 8, 10, 13, 17, 20, 22]
    },
    {
        from: 'CCU', to: 'DEL', durationMins: 140, basePrice: 4600,
        airlines: ['6E','AI','SG','UK','I5'],
        flightTimes: [6, 8, 10, 13, 17, 20, 22]
    },
    // BOM ↔ BLR (Mumbai ↔ Bangalore)
    {
        from: 'BOM', to: 'BLR', durationMins: 80, basePrice: 3200,
        airlines: ['6E','AI','SG','UK','I5','QP'],
        flightTimes: [6, 7, 8, 9, 10, 12, 14, 16, 17, 18, 19, 20, 21]
    },
    {
        from: 'BLR', to: 'BOM', durationMins: 80, basePrice: 3200,
        airlines: ['6E','AI','SG','UK','I5','QP'],
        flightTimes: [6, 7, 8, 9, 10, 12, 14, 16, 17, 18, 19, 20, 21]
    },
    // BOM ↔ HYD (Mumbai ↔ Hyderabad)
    {
        from: 'BOM', to: 'HYD', durationMins: 75, basePrice: 3000,
        airlines: ['6E','SG','UK','I5','QP'],
        flightTimes: [6, 8, 10, 13, 15, 17, 19, 21]
    },
    {
        from: 'HYD', to: 'BOM', durationMins: 75, basePrice: 3000,
        airlines: ['6E','SG','UK','I5','QP'],
        flightTimes: [6, 8, 10, 13, 15, 17, 19, 21]
    },
    // BOM ↔ MAA (Mumbai ↔ Chennai)
    {
        from: 'BOM', to: 'MAA', durationMins: 100, basePrice: 3500,
        airlines: ['6E','AI','SG','UK'],
        flightTimes: [6, 8, 11, 14, 17, 20]
    },
    {
        from: 'MAA', to: 'BOM', durationMins: 100, basePrice: 3500,
        airlines: ['6E','AI','SG','UK'],
        flightTimes: [6, 8, 11, 14, 17, 20]
    },
    // BOM ↔ GOI (Mumbai ↔ Goa)
    {
        from: 'BOM', to: 'GOI', durationMins: 60, basePrice: 2800,
        airlines: ['6E','SG','I5','QP'],
        flightTimes: [6, 8, 10, 12, 14, 16, 18, 20]
    },
    {
        from: 'GOI', to: 'BOM', durationMins: 60, basePrice: 2800,
        airlines: ['6E','SG','I5','QP'],
        flightTimes: [7, 9, 11, 13, 15, 17, 19, 21]
    },
    // BLR ↔ HYD (Bangalore ↔ Hyderabad)
    {
        from: 'BLR', to: 'HYD', durationMins: 65, basePrice: 2600,
        airlines: ['6E','SG','UK','I5','QP'],
        flightTimes: [6, 8, 10, 12, 14, 16, 18, 20]
    },
    {
        from: 'HYD', to: 'BLR', durationMins: 65, basePrice: 2600,
        airlines: ['6E','SG','UK','I5','QP'],
        flightTimes: [7, 9, 11, 13, 15, 17, 19, 21]
    },
    // BLR ↔ MAA (Bangalore ↔ Chennai)
    {
        from: 'BLR', to: 'MAA', durationMins: 55, basePrice: 2400,
        airlines: ['6E','AI','SG','UK','I5'],
        flightTimes: [6, 8, 10, 12, 14, 16, 18, 20]
    },
    {
        from: 'MAA', to: 'BLR', durationMins: 55, basePrice: 2400,
        airlines: ['6E','AI','SG','UK','I5'],
        flightTimes: [7, 9, 11, 13, 15, 17, 19, 21]
    },
    // DEL ↔ JAI (Delhi ↔ Jaipur)
    {
        from: 'DEL', to: 'JAI', durationMins: 50, basePrice: 2200,
        airlines: ['6E','SG','AI'],
        flightTimes: [7, 9, 12, 15, 18, 20]
    },
    {
        from: 'JAI', to: 'DEL', durationMins: 50, basePrice: 2200,
        airlines: ['6E','SG','AI'],
        flightTimes: [8, 10, 13, 16, 19, 21]
    },
    // DEL ↔ AMD (Delhi ↔ Ahmedabad)
    {
        from: 'DEL', to: 'AMD', durationMins: 90, basePrice: 3400,
        airlines: ['6E','AI','SG','UK'],
        flightTimes: [6, 8, 10, 13, 17, 20]
    },
    {
        from: 'AMD', to: 'DEL', durationMins: 90, basePrice: 3400,
        airlines: ['6E','AI','SG','UK'],
        flightTimes: [7, 9, 11, 14, 18, 21]
    },
    // BLR ↔ CCU (Bangalore ↔ Kolkata)
    {
        from: 'BLR', to: 'CCU', durationMins: 140, basePrice: 4900,
        airlines: ['6E','AI','SG'],
        flightTimes: [6, 10, 15, 20]
    },
    {
        from: 'CCU', to: 'BLR', durationMins: 140, basePrice: 4900,
        airlines: ['6E','AI','SG'],
        flightTimes: [7, 11, 16, 21]
    },
    // DEL ↔ COK (Delhi ↔ Kochi)
    {
        from: 'DEL', to: 'COK', durationMins: 190, basePrice: 5800,
        airlines: ['6E','AI','IX'],
        flightTimes: [6, 10, 15, 22]
    },
    {
        from: 'COK', to: 'DEL', durationMins: 190, basePrice: 5800,
        airlines: ['6E','AI','IX'],
        flightTimes: [5, 9, 14, 21]
    },

    // ── INTERNATIONAL ROUTES ──────────────────────────────────────────────────

    // DEL ↔ DXB (Delhi ↔ Dubai)
    {
        from: 'DEL', to: 'DXB', durationMins: 210, basePrice: 18000,
        airlines: ['AI','EK','EY'],
        flightTimes: [2, 6, 10, 14, 18, 22]
    },
    {
        from: 'DXB', to: 'DEL', durationMins: 210, basePrice: 18000,
        airlines: ['AI','EK','EY'],
        flightTimes: [2, 7, 11, 15, 19, 23]
    },
    // BOM ↔ DXB (Mumbai ↔ Dubai)
    {
        from: 'BOM', to: 'DXB', durationMins: 185, basePrice: 16500,
        airlines: ['AI','EK','EY'],
        flightTimes: [1, 5, 9, 13, 17, 21]
    },
    {
        from: 'DXB', to: 'BOM', durationMins: 185, basePrice: 16500,
        airlines: ['AI','EK','EY'],
        flightTimes: [3, 8, 12, 16, 20, 23]
    },
    // DEL ↔ DOH (Delhi ↔ Doha)
    {
        from: 'DEL', to: 'DOH', durationMins: 255, basePrice: 19000,
        airlines: ['AI','QR'],
        flightTimes: [3, 9, 15, 21]
    },
    {
        from: 'DOH', to: 'DEL', durationMins: 255, basePrice: 19000,
        airlines: ['AI','QR'],
        flightTimes: [4, 10, 16, 22]
    },
    // BOM ↔ DOH (Mumbai ↔ Doha)
    {
        from: 'BOM', to: 'DOH', durationMins: 240, basePrice: 17500,
        airlines: ['AI','QR'],
        flightTimes: [2, 8, 14, 20]
    },
    {
        from: 'DOH', to: 'BOM', durationMins: 240, basePrice: 17500,
        airlines: ['AI','QR'],
        flightTimes: [3, 9, 15, 21]
    },
    // DEL ↔ AUH (Delhi ↔ Abu Dhabi)
    {
        from: 'DEL', to: 'AUH', durationMins: 230, basePrice: 19500,
        airlines: ['AI','EY'],
        flightTimes: [4, 10, 16, 22]
    },
    {
        from: 'AUH', to: 'DEL', durationMins: 230, basePrice: 19500,
        airlines: ['AI','EY'],
        flightTimes: [5, 11, 17, 23]
    },
    // DEL ↔ SIN (Delhi ↔ Singapore)
    {
        from: 'DEL', to: 'SIN', durationMins: 330, basePrice: 24000,
        airlines: ['AI','SQ','I5'],
        flightTimes: [1, 7, 13, 20]
    },
    {
        from: 'SIN', to: 'DEL', durationMins: 330, basePrice: 24000,
        airlines: ['AI','SQ','I5'],
        flightTimes: [2, 8, 14, 21]
    },
    // BOM ↔ SIN (Mumbai ↔ Singapore)
    {
        from: 'BOM', to: 'SIN', durationMins: 315, basePrice: 22500,
        airlines: ['AI','SQ'],
        flightTimes: [2, 8, 14, 21]
    },
    {
        from: 'SIN', to: 'BOM', durationMins: 315, basePrice: 22500,
        airlines: ['AI','SQ'],
        flightTimes: [3, 10, 16, 22]
    },
    // BLR ↔ SIN (Bangalore ↔ Singapore)
    {
        from: 'BLR', to: 'SIN', durationMins: 300, basePrice: 21000,
        airlines: ['AI','SQ','I5'],
        flightTimes: [1, 8, 15, 22]
    },
    {
        from: 'SIN', to: 'BLR', durationMins: 300, basePrice: 21000,
        airlines: ['AI','SQ','I5'],
        flightTimes: [2, 9, 16, 23]
    },
    // DEL ↔ BKK (Delhi ↔ Bangkok)
    {
        from: 'DEL', to: 'BKK', durationMins: 270, basePrice: 20000,
        airlines: ['AI','QR'],
        flightTimes: [2, 9, 16, 22]
    },
    {
        from: 'BKK', to: 'DEL', durationMins: 270, basePrice: 20000,
        airlines: ['AI','QR'],
        flightTimes: [3, 10, 17, 23]
    },
    // DEL ↔ LHR (Delhi ↔ London Heathrow)
    {
        from: 'DEL', to: 'LHR', durationMins: 550, basePrice: 52000,
        airlines: ['AI','BA'],
        flightTimes: [2, 9, 20]
    },
    {
        from: 'LHR', to: 'DEL', durationMins: 550, basePrice: 52000,
        airlines: ['AI','BA'],
        flightTimes: [14, 20, 23]
    },
    // BOM ↔ LHR (Mumbai ↔ London Heathrow)
    {
        from: 'BOM', to: 'LHR', durationMins: 565, basePrice: 55000,
        airlines: ['AI','BA'],
        flightTimes: [1, 10, 21]
    },
    {
        from: 'LHR', to: 'BOM', durationMins: 565, basePrice: 55000,
        airlines: ['AI','BA'],
        flightTimes: [13, 19, 22]
    },
    // DEL ↔ JFK (Delhi ↔ New York JFK)
    {
        from: 'DEL', to: 'JFK', durationMins: 870, basePrice: 72000,
        airlines: ['AI'],
        flightTimes: [2, 14]
    },
    {
        from: 'JFK', to: 'DEL', durationMins: 870, basePrice: 72000,
        airlines: ['AI'],
        flightTimes: [22, 11]
    },
    // LAX ↔ DXB (Los Angeles ↔ Dubai)
    {
        from: 'LAX', to: 'DXB', durationMins: 980, basePrice: 95000,
        airlines: ['EK'],
        flightTimes: [9, 22]
    },
    {
        from: 'DXB', to: 'LAX', durationMins: 980, basePrice: 95000,
        airlines: ['EK'],
        flightTimes: [8, 20]
    },
    // LHR ↔ DXB (London ↔ Dubai)
    {
        from: 'LHR', to: 'DXB', durationMins: 420, basePrice: 38000,
        airlines: ['EK','BA'],
        flightTimes: [8, 13, 19, 22]
    },
    {
        from: 'DXB', to: 'LHR', durationMins: 420, basePrice: 38000,
        airlines: ['EK','BA'],
        flightTimes: [3, 9, 14, 21]
    },
    // JFK ↔ LHR (New York ↔ London)
    {
        from: 'JFK', to: 'LHR', durationMins: 420, basePrice: 62000,
        airlines: ['BA'],
        flightTimes: [22, 17, 10]
    },
    {
        from: 'LHR', to: 'JFK', durationMins: 420, basePrice: 62000,
        airlines: ['BA'],
        flightTimes: [11, 17, 21]
    },
];

// Cabin class configs
const CABIN_CLASSES = [
    { name: 'Economy',     priceMultiplier: 1.0,  amenities: ['Meals'],                    seats: [42, 55, 68, 80] },
    { name: 'Business',    priceMultiplier: 2.8,  amenities: ['WiFi', 'Meals', 'Entertainment'], seats: [8, 12, 16] },
    { name: 'First Class', priceMultiplier: 4.5,  amenities: ['WiFi', 'Meals', 'Entertainment'], seats: [4, 6, 8]  },
];

const AIRLINE_MAP = Object.fromEntries(AIRLINES.map(a => [a.code, a]));
const ROUTE_MAP = {};
for (const r of ROUTES) {
    ROUTE_MAP[`${r.from}-${r.to}`] = r;
}

module.exports = { AIRLINES, ROUTES, CABIN_CLASSES, AIRLINE_MAP, ROUTE_MAP };
