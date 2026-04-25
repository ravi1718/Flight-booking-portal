const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getMyBookings, getBookingById, confirmBookingPayment } = require('../controllers/bookingController');

router.route('/').post(protect, createBooking).get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/pay').put(protect, confirmBookingPayment);

module.exports = router;
