const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        bus: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Bus',
        },
        seats: [
            {
                type: String, // Seat numbers like 'A1', 'B2'
                required: true,
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        passengerDetails: [
            {
                name: { type: String, required: true },
                age: { type: Number, required: true },
                gender: { type: String, required: true },
            }
        ],
        status: {
            type: String,
            required: true,
            default: 'confirmed', // booked, cancelled
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
