const Flight = require('../models/Flight');

const PNR_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generatePNR() {
    return Array.from({ length: 6 }, () =>
        PNR_CHARS[Math.floor(Math.random() * PNR_CHARS.length)]
    ).join('');
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];

async function assignSeats(flight, count) {
    // Atomically grab the current seat state before incrementing
    const updated = await Flight.findByIdAndUpdate(
        flight._id,
        { $inc: { lastSeatCol: count } },
        { returnDocument: 'before', runValidators: false }
    );

    // Compute seats from the pre-update values
    let row = updated.lastSeatRow;
    let col = updated.lastSeatCol;
    const seats = [];

    for (let i = 0; i < count; i++) {
        seats.push(`${row}${COLS[col % 6]}`);
        col++;
        if (col % 6 === 0) row++;
    }

    // Persist correct row if it changed
    const newRow = updated.lastSeatRow + Math.floor((updated.lastSeatCol + count) / 6);
    if (newRow !== updated.lastSeatRow) {
        await Flight.findByIdAndUpdate(flight._id, { $set: { lastSeatRow: newRow } });
    }

    return seats;
}

module.exports = { generatePNR, assignSeats };
