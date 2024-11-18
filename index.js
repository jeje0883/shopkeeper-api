import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';

config(); 

const {MONGODB_URL,SERVER_PORT,ALLOWED_CLIENT } = process.env;

if (!MONGODB_URL) {
    console.error('Missing MONGODB_URL environment variable');
    process.exit(1);
}

const allowedOrigins = [
    'http://localhost:3000',
    ALLOWED_CLIENT,
    ];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

mongoose.connect(MONGODB_URL)
.then(() => console.log('Now connected to MongoDB Atlas Server'))
.catch(err => {
    console.error('MongoDB connection error: ', err)
    process.exit(1);
})

const app = express();
app.use(cors(corsOptions));
app.use(express.json);
app.use(express.urlencoded({ extended}));

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

export { app, mongoose };