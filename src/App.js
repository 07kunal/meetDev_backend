const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.js');
var timeout = require('connect-timeout');
const cors = require('cors')
const PORT_backend= process?.env?.PORT_backend;
const PORT_frontend= process?.env?.PORT_frontend;
console.log('portfrontend',PORT_frontend);
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
app.use(cors({
    origin:"http://localhost:5173",
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




