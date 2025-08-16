const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const User = require('./model/user.js');

// creating the post request,

app.post('/signup', async (req,res) => {
    
    //  Creating the new instance from the model
    const userDetails = new User({
        firstName: 'Rahul',
        lastName: 'Gautam',
        email: 'kunalTest21@gmail.com',
        password: 'test#321'
    })
    await userDetails.save();
  res.send("user add done");
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
