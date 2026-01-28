const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/Bus');
const Booking = require('./models/Booking');

dotenv.config();

const randomFutureDate = (hour, minute = 0) => {
  const daysAhead = Math.floor(Math.random() * 7); // next 7 days
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const generateSeats = (total = 40) => {
    const seats = [];
    const rows = ['L', 'R'];
    const cols = Math.ceil(total / 2); // roughly

    // Create standard sleeper/seater mix
    // Lower Deck (Seater)
    for (let i = 1; i <= 20; i++) {
        seats.push({ number: `L${i}`, isBooked: false, gender: null });
    }
    // Upper Deck (Sleeper)
    for (let i = 1; i <= 20; i++) {
        seats.push({ number: `U${i}`, isBooked: false, gender: null });
    }
    return seats;
};

const buses = [
    {
        name: 'Neeta Travels',
        source: 'Mumbai',
        destination: 'Pune',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 450,
        type: 'AC Seater',
        amenities: ['Water', 'Charging Point', 'Reading Light'],
        rating: 4.2,
        seats: generateSeats(40),
    },
    {
        name: 'Purple Metrolink',
        source: 'Mumbai',
        destination: 'Pune',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 550,
        type: 'Volvo',
        amenities: ['WiFi', 'Water', 'Blanket'],
        rating: 4.7,
        seats: generateSeats(40),
    },
    {
        name: 'ZingBus',
        source: 'Delhi',
        destination: 'Jaipur',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 600,
        type: 'AC Sleeper',
        amenities: ['WiFi', 'Charging Point', 'TV', 'Blanket'],
        rating: 4.5,
        seats: generateSeats(40),
    },
    {
        name: 'VRL Logistics',
        source: 'Mumbai',
        destination: 'Goa',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 1200,
        type: 'AC Sleeper',
        amenities: ['WiFi', 'Water', 'Blanket', 'Dinner Stop'],
        rating: 4.8,
        seats: generateSeats(36),
    },
    {
        name: 'IntrCity SmartBus',
        source: 'Delhi',
        destination: 'Manali',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 1500,
        type: 'Volvo',
        amenities: ['WiFi', 'Clean Toilet', 'Water', 'Blanket'],
        rating: 4.6,
        seats: generateSeats(40),
    },
    {
        name: 'Shivneri (MSRTC)',
        source: 'Pune',
        destination: 'Mumbai',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 500,
        type: 'Volvo',
        amenities: ['Water', 'Newspaper'],
        rating: 4.3,
        seats: generateSeats(45),
    },
    // Add duplicates for variety in search
    {
        name: 'Hans Travels',
        source: 'Mumbai',
        destination: 'Pune',
       departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 400,
        type: 'Non-AC Seater',
        amenities: ['Charging Point'],
        rating: 3.8,
        seats: generateSeats(40),
    },
    {
        name: 'Paulo Travels',
        source: 'Mumbai',
        destination: 'Goa',
       departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 1100,
        type: 'AC Sleeper',
        amenities: ['WiFi', 'Blanket'],
        rating: 4.0,
        seats: generateSeats(36),
    },
    {
        name: 'Gujarat Travels',
        source: 'Mumbai',
        destination: 'Ahmedabad',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 900,
        type: 'AC Sleeper',
        amenities: ['Charging Point', 'Reading Light'],
        rating: 4.1,
        seats: generateSeats(36),
    },
    {
        name: 'Shrinath Travels',
        source: 'Delhi',
        destination: 'Jaipur',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        price: 550,
        type: 'AC Sleeper',
        amenities: ['Blanket'],
        rating: 4.0,
        seats: generateSeats(40),
    }
];

const importData = async () => {
    await connectDB();

    try {
        await Bus.deleteMany();
        await Booking.deleteMany();

        await Bus.insertMany(buses);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    await connectDB();

    try {
        await Bus.deleteMany();
        await Booking.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
