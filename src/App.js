const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.js');
var timeout = require('connect-timeout');
const cors = require('cors');
const { getSecrets } = require('./utils/getSecrets.js');

async function startServer() {
    try {
        // Load configuration before connecting to services that depend on it.
        await getSecrets();
        console.log('Secrets loaded successfully!');

        // 2. Read the ports now that environment variables are populated
        const PORT_backend = process?.env?.PORT_backend || 3000;
        const PORT_frontend = process?.env?.PORT_frontend || 5173;

        // 3. Connect to the Database
        await connectDB();
        console.log('Connected! to the DB');
        app.listen(PORT_backend, () => {
            console.log(`Server is running on port ${PORT_backend}`);
        });
        // 4. Initialize Cron Jobs
        require('./utils/cronjobs.js');

        // 5. Apply Middlewares
        app.use(cors({
            origin: `http://localhost:${PORT_frontend}`,
            credentials: true
        }));

        // Converts incoming JSON into Javascript object
        app.use(express.json());

        // Set request timeout
        app.use(timeout('10s'));

        // Cookie parser
        app.use(cookieParser());

        // 6. Define Application Routes
        app.use('/', indexRouter);
    } catch (err) {
        console.error('Initialization error, server shutting down:', err);
        process.exit(1);
    }
}

// Execute the server start sequence
startServer();


