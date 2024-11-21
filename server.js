// server.js
import { app } from './index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { SERVER_PORT = '4000' } = process.env;
const port = parseInt(SERVER_PORT, 10);

// Validate SERVER_PORT
if (isNaN(port) || port < 0 || port > 65535) {
    console.error(`Invalid SERVER_PORT: ${SERVER_PORT}`);
    process.exit(1);
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
