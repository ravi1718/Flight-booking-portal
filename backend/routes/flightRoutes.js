const express = require('express');
const router = express.Router();
const { searchFlights, getFlightById, seedFlights } = require('../controllers/flightController');

router.post('/seed', seedFlights);
router.get('/', searchFlights);
router.get('/:id', getFlightById);

module.exports = router;
