// server.js
import { app } from './index.js';

// Retrieve and validate the server port
const { SERVER_PORT = 5000 } = process.env;
const port = parseInt(SERVER_PORT, 10);

if (isNaN(port)) {
    console.error(`Invalid SERVER_PORT: ${SERVER_PORT}`);
    process.exit(1);
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
