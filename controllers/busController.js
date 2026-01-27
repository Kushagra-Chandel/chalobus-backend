const Bus = require('../models/Bus');

// @desc    Get all buses or search
// @route   GET /api/buses
// @access  Public
const getBuses = async (req, res) => {
    const { source, destination, date } = req.query;
    let query = {};

    if (source) {
        query.source = { $regex: source, $options: 'i' };
    }
    if (destination) {
        query.destination = { $regex: destination, $options: 'i' };
    }
    if (date) {
        // Basic date filtering - matches the day
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        query.departureTime = {
            $gte: startDate,
            $lt: endDate
        };
    }

    try {
        const buses = await Bus.find(query);
        res.json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bus by ID
// @route   GET /api/buses/:id
// @access  Public
const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);

        if (bus) {
            res.json(bus);
        } else {
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBuses,
    getBusById,
    // Add createBus for seeder/admin later
};
