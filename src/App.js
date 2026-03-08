const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const bcrypt = require('bcrypt');
const { validation } = require('./validator/validator.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth_middleware.js');
const { User } = require('./model/user.js');

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

// Creating and storing the user information into the DB. 
app.post('/signup', async (req, res) => {
    try {
        validation(req.body);
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);

        const userModel = new User({
            ...req.body,
            password: hashPassword
        });

        await userModel.save();
        res.status(200).json({ response: 'User Successfully register' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/* IN method all the callbacks made to asyn function which always return the promise.
Reason: finding the particular or all the user require the db filteration hence it take time which lead to provide the response in some time but always return something which might be perfect response or error. 
*/
// login api,
app.post('/login', async (req, res) => {
    try {
        const userFind = await User.findOne({ emailId: req.body.emailId });
        if (!userFind) throw new Error('User does not exit');
        let isPasswordValid = userFind.decrptedPwd(userFind.password)
        if (isPasswordValid) {
            // Adding the logic to authenticate the token
            const token = await userFind.getJWT();
            res.cookie('token', token)
            res.status(200).json({ status: isPasswordValid });
        } else {
            res.status(404).json({ status: isPasswordValid, message: 'Invalid password' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// get the profile

app.get('/profile', userAuth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error.message);

    }
});


// Getting all the user at once. 

app.get('/feed', userAuth, async (req, res) => {
    try {
        const userData = await User.find({});
        if (userData || userData.length > 0) {
            res.send(userData);
        } else {
            res.status(400).send("User not found");
        }

    } catch (error) {
        console.log('error', error);
    }
});

// Creating Delete api that that delete the user from the DB using the _id
app.delete('/user_delete', userAuth, async (req, res) => {
    const userId = req?.body?.userId;
    try {
        const deletedUser = await User.findByIdAndDelete({ _id: userId });
        console.log('deletedUser', deletedUser);
        if (deletedUser) {

            res.send("Selected user deleted");
        } else {
            res.status(400).send("Error occured");

        }
    } catch (error) {
        res.status(400).send("Error occured", error.message);

    }

});

// Update the Data for the particular UserId

app.patch('/user_update/:userId', userAuth, async (req, res) => {

    const { userId } = req?.params;
    console.log('userId', userId);
    const updatedData = req.body;
    try {
        let updatedAllowed = ['firstName', 'lastName', 'age', 'photoURL', 'skills'];
        let isUpdateAllowed = Object.keys(updatedData).every((k) => updatedAllowed.includes(k));
        if (!isUpdateAllowed) {
            res.status(400).send("Update not allowed");
        }
        const udpateUser = await User.findByIdAndUpdate(userId, updatedData, { returnDocument: 'before' });
        console.log('updateUser', udpateUser)
        res.send('User data update successfully');

    } catch (error) {
        res.status(400).send("Error occured", error.message);

    }
});



