import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import feedbackRoutes from './routes/feedbackRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import config from './config.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', feedbackRoutes);
app.use('/', courseRoutes);

mongoose.connect(config.MONGODB_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

export default app;