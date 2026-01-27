const mongoose = require('mongoose');

const seatSchema = mongoose.Schema({
    number: { type: String, required: true },
    isBooked: { type: Boolean, required: true, default: false },
    gender: { type: String, enum: ['male', 'female', null], default: null }, // booked by gender if applicable
});

const busSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        departureTime: {
            type: Date,
            required: true,
        },
        arrivalTime: {
            type: Date,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['AC Seater', 'Non-AC Seater', 'AC Sleeper', 'Volvo'],
            required: true,
        },
        seats: [seatSchema],
        amenities: [String],
        rating: {
            type: Number,
            default: 4.5,
        },
    },
    {
        timestamps: true,
    }
);

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
