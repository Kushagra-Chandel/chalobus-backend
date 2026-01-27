const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        console.log('--- Starting End-to-End API Test ---');

        // 1. Register User
        const userEmail = `test${Date.now()}@example.com`;
        console.log(`\n1. Testing Register with ${userEmail}...`);
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: userEmail,
            password: 'password123'
        });
        console.log('✅ Register Success:', registerRes.status === 201);
        const token = registerRes.data.token;
        const userId = registerRes.data._id;

        // 2. Login User
        console.log('\n2. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: userEmail,
            password: 'password123'
        });
        console.log('✅ Login Success:', loginRes.status === 200);

        // 3. Search Buses
        console.log('\n3. Testing Bus Search...');
        const busesRes = await axios.get(`${API_URL}/buses?source=Mum&destination=Pun`);
        console.log(`✅ Bus Search Success: Found ${busesRes.data.length} buses`);

        if (busesRes.data.length === 0) {
            throw new Error('No buses found to book!');
        }
        const bus = busesRes.data[0];

        // 4. Create Booking
        console.log('\n4. Testing Booking...');
        const bookingRes = await axios.post(`${API_URL}/bookings`, {
            busId: bus._id,
            seats: ['A1'],
            totalPrice: bus.price,
            passengerDetails: [{ name: 'Test Passenger', age: 25, gender: 'M' }]
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Booking Success:', bookingRes.status === 201);

        // 5. Get My Bookings
        console.log('\n5. Testing My Bookings...');
        const myBookingsRes = await axios.get(`${API_URL}/bookings/mybookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ My Bookings Success: Found ${myBookingsRes.data.length} bookings`);

        console.log('\n--- 🎉 All Backend Tests Passed 🎉 ---');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

runTest();
