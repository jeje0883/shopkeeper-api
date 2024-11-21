import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const { MONGODB_URL, ALLOWED_CLIENT } = process.env;

// Validate essential environment variables
if (!MONGODB_URL) {
    console.error('Missing MONGODB_URL environment variable');
    process.exit(1);
}

// Initialize allowedOrigins with localhost for development
const allowedOrigins = ['http://localhost:3000'];

// If ALLOWED_CLIENT is defined, add it to allowedOrigins
if (ALLOWED_CLIENT) {
    allowedOrigins.push(ALLOWED_CLIENT.trim());
} else {
    console.warn('ALLOWED_CLIENT is not defined. Only localhost:3000 is allowed.');
}

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// MongoDB Connection
mongoose
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas Server'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const app = express();

// Apply Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example Route
app.get('/', (req, res) => {
    res.status(200).send('Server is up and running!');
});

// User Routes
import userRoutes from './routes/userRoute.js';
app.use('/api/v1/users', userRoutes);

// Export the app and mongoose connection
export { app, mongoose };
