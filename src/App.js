const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const User = require('./model/user.js');

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

// Creating and storing the user information into the DB. 

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
// Filter the user with the emailId or else. by using the find method of the mongoose. 
app.get('/user', async (req, res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.findOne({ email: userEmail });
        console.log('user', user);
        if (user || user.length > 0) {
            res.send(user);
        } else {
            res.status(404).send("User not found");

        }
    } catch (error) {
        res.status(400).send("Error occured", error.message);
    }

});

// Getting all the user at once. 

app.get('/feed', async (req, res) => {
    try {
        const userData = await User.find({});
        if (userData || userData.length > 0) {
            res.send(userData);
        } else {
            res.status(400).send("User not found");
        }
    } catch (error) {

    }
});



