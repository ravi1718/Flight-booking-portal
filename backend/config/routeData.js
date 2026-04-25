// Real Indian airline routes with scheduled departure times and base prices
// Airlines: IndiGo (6E), Air India (AI), SpiceJet (SG), Vistara (UK),
//           AirAsia India (I5), Akasa Air (QP), Air India Express (IX)

const AIRLINES = [
    { code: '6E', name: 'IndiGo',          logo: '🔵', baseMultiplier: 1.0  },
    { code: 'AI', name: 'Air India',        logo: '🔴', baseMultiplier: 1.25 },
    { code: 'SG', name: 'SpiceJet',         logo: '🟠', baseMultiplier: 0.90 },
    { code: 'UK', name: 'Vistara',          logo: '🟣', baseMultiplier: 1.35 },
    { code: 'I5', name: 'AirAsia India',    logo: '🟥', baseMultiplier: 0.85 },
    { code: 'QP', name: 'Akasa Air',        logo: '🟡', baseMultiplier: 0.92 },
    { code: 'IX', name: 'Air India Express',logo: '🔶', baseMultiplier: 0.95 },
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
