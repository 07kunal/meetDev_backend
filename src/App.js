const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const User = require('./model/user.js');

// creating the post request,
app.use(express.json());
app.post('/signup', async (req, res) => {

    //  Creating the new instance from the user model and data which pass from the end user ( like UI, postman );
    const userDetails = new User(req.body);
    try {
        await userDetails.save();
        res.send("user add done");
    } catch (error) {
        res.status(400).send("Error occured", error.message);
    }

});

connectDB().
    then(() => {
        // first connect to the DB
        console.log('Connected! to the DB');

        // then listen to the port : 3000
        app.listen(3000, () => {
            console.log('Server is running');
        });
    }).
    catch((err) => console.log('err', err))
