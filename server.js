const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
//const mongoSanitize = require('express-mongo-sanitize');
//const xss = require('xss-clean');
const hpp = require('hpp');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const morgan = require('morgan');
const logger = require('./utils/logger');


dotenv.config();

// Connect to Database
connectDB();

const app = express();

// ---------------- SECURITY MIDDLEWARES ----------------
app.use(helmet());              // Secure headers
app.use(express.json());       // Body parser
//app.use(mongoSanitize());
//app.use(xss());                // Prevent XSS
//app.use(hpp());                // Prevent parameter pollution
// HTTP request logging
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);


// Rate limiter (only on auth + booking routes)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100, // 100 requests per IP
});
app.use('/api', limiter);

// CORS
app.use(cors());


// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const errorHandler = require('./middleware/ErrorMiddleware');
// After all routes
app.use(errorHandler);

