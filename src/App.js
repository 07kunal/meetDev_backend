const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.js');
var timeout = require('connect-timeout');
const cors = require('cors');
require('./utils/getSecrets.js');


const PORT_backend= process?.env?.PORT_backend;
const PORT_frontend= process?.env?.PORT_frontend;
connectDB().
    then(() => {
        // first connect to the DB
        console.log('Connected! to the DB');

        app.listen(PORT_backend, () => {
            console.log('Server is running');
        });
    }).
    catch((err) => console.log('err', err));
// Adds headers: Access-Control-Allow-Origin: *
require('./utils/cronjobs.js');


app.use(cors({
    origin:`http://localhost:${PORT_frontend}`,
    credentials:true
}));
// Middle ware that will convert the json into javascript object that can under stand by the server. 
app.use(express.json());
app.use(timeout('10s'))
// cookies parser;
/*
Cookie parser  will help to read the cookie parser and use it in the application. 
*/
app.use(cookieParser());
app.use('/', indexRouter);




const express = require('express');
const cookieParser = require('cookie-parser');
const timeout = require('connect-timeout');
const cors = require('cors');

const { connectDB } = require('./config/database.js');
const indexRouter = require('./routes/index.js');

const app = express();

// Main bootstrap function to handle async initialization sequence
async function startServer() {
    try {
        // 1. Load your secrets first and wait for the promise to complete
        // (Assuming getSecrets() exports a function that fetches secrets)
        await require('./utils/getSecrets.js').getSecrets();
        console.log('Secrets loaded successfully!');

        // 2. Read the ports now that environment variables are populated
        const PORT_backend = process?.env?.PORT_backend || 3000;
        const PORT_frontend = process?.env?.PORT_frontend || 5173;

        // 3. Connect to the Database
        await connectDB();
        console.log('Connected! to the DB');

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

        // 7. Start listening for incoming traffic
        app.listen(PORT_backend, () => {
            console.log(`Server is running on port ${PORT_backend}`);
        });

    } catch (err) {
        console.error('Initialization error, server shutting down:', err);
        process.exit(1); 
    }
}

// Execute the server start sequence
startServer();


