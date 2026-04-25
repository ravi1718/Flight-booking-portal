const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { confirmPayment } = require('../controllers/paymentController');

router.post('/', protect, confirmPayment);

module.exports = router;
