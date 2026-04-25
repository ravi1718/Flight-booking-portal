// Payment is dummy — no real card processing.
// The actual seat decrement and boarding pass generation happen in
// bookingController.confirmBookingPayment (PUT /api/bookings/:id/pay).
const confirmPayment = async (req, res) => {
    res.json({ success: true, message: 'Payment accepted (test mode)' });
};

module.exports = { confirmPayment };
