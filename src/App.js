const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.js');


connectDB().
    then(() => {
        // first connect to the DB
        console.log('Connected! to the DB');

        // then listen to the port : 3000
        app.listen(3000, () => {
            console.log('Server is running');
        });
    }).
    catch((err) => console.log('err', err));

// Middle ware that will convert the json into javascript object that can under stand by the server. 
app.use(express.json());
// cookies parser;
/*
Cookie parser  will help to read the cookie parser and use it in the application. 
*/
app.use(cookieParser());
app.use('/', indexRouter);




