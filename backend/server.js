// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import the path module

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('FATAL ERROR: MONGO_URI or JWT_SECRET is not defined in .env file.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ADD THIS ---
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/swaps', require('./routes/swaps'));
// --- ADD THIS ---
app.use('/api/upload', require('./routes/upload')); // Use the new upload route

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));