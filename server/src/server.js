import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import feedbackRoutes from '../routes/feedbackRoutes.js';
import courseRoutes from '../routes/courseRoutes.js';
import config from '../config.js';

const app = express();

// Configure CORS to allow specific origins
const allowedOrigins = [
    'https://sentiment-dashboard.vercel.app',
    'https://customer-feedback-dashboard-b4wg.onrender.com'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies if needed
}));

app.use(express.json());

// Define routes
app.use('/', feedbackRoutes);
app.use('/', courseRoutes);

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

export default app;
