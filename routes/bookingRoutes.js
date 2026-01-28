const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const { body } = require('express-validator');

router.route('/').post(
  protect,
  [
    body('busId').notEmpty().withMessage('busId is required'),
    body('seats').isArray({ min: 1 }).withMessage('Seats required'),
    body('totalPrice').isNumeric().withMessage('Price must be number'),
  ],
  createBooking
);

router.route('/mybookings').get(protect, getMyBookings);

module.exports = router;
