const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { busId, seats, totalPrice, passengerDetails } = req.body;

    try {
        const bus = await Bus.findById(busId);

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Check if any of the requested seats are already booked
        const alreadyBooked = bus.seats.some(seat =>
            seats.includes(seat.number) && seat.isBooked
        );

        if (alreadyBooked) {
            return res.status(400).json({ message: 'One or more selected seats are already booked.' });
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
        res.status(201).json(createdBooking);
    } catch (error) {
        // If error, ideally we should rollback seat locking, but for simulation, we'll keep it simple
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('bus').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
};
