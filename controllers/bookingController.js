const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const { success, error } = require('../utils/apiResponse');




// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {

    const { busId, seats, totalPrice, passengerDetails } = req.body;

    try {
        const bus = await Bus.findById(busId);

        if (!bus) {
            return next(new AppError("Bus not found", 404));
        }

        // Check if any of the requested seats are already booked
        const alreadyBooked = bus.seats.some(seat =>
            seats.includes(seat.number) && seat.isBooked
        );

        if (alreadyBooked) {
            return next(new AppError("One or more selected seats are already booked.", 400));
        }

        // Lock the seats
        // In MongoDB, we can use arrayFilters to update specific elements in an array
        await Bus.updateOne(
            { _id: busId },
            { $set: { "seats.$[elem].isBooked": true } },
            {
                arrayFilters: [{ "elem.number": { $in: seats } }]
            }
        );

        const booking = new Booking({
            user: req.user._id,
            bus: busId,
            seats,
            totalPrice,
            passengerDetails
        });

        const createdBooking = await booking.save();
        logger.info(`Booking created: ${createdBooking._id}`);
        return success(res, "Booking created successfully", createdBooking);

    } catch (err) {
  logger.error(err.message);
  return next(new AppError(err.message || "Booking failed", 500));
}

};

// @desc    Get logged in user orders
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('bus').sort({ createdAt: -1 });
        return success(res, "Bookings fetched successfully", bookings);
    } catch (error) {
        logger.error(error.message);
        return next(new AppError("Failed to fetch bookings", 500));
    }
};

module.exports = {
    createBooking,
    getMyBookings,
};
