import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
config();

const { MONGODB_URL, ALLOWED_CLIENT, SERVER_PORT } = process.env;

if (!MONGODB_URL) {
    console.error('Missing MONGODB_URL environment variable');
    process.exit(1);
}

// Initialize allowedOrigins
const allowedOrigins = ['http://localhost:3000'];
if (ALLOWED_CLIENT) allowedOrigins.push(ALLOWED_CLIENT.trim());

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        console.error(`Blocked by CORS: Origin ${origin} is not allowed.`);
        callback(new Error('Not allowed by CORS'), false);
    },
    optionsSuccessStatus: 200,
};

// MongoDB Connection
await mongoose
    .connect(MONGODB_URL)
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


// Convert import.meta.url to a file path
const currentFilePath = fileURLToPath(import.meta.url);

// Normalize process.argv[1] to match currentFilePath
const scriptFilePath = path.resolve(process.argv[1]);

if (currentFilePath === scriptFilePath) {
    const PORT_NUM = SERVER_PORT || 4000;
    app.listen(PORT_NUM, () => {
        console.log(`Server running on http://localhost:${PORT_NUM}`);
    });
} else {
    console.log('Server file was imported, not executed.');
}


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export { app, mongoose };