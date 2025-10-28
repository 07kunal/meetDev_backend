const express = require('express');
const app = express();
const { connectDB } = require('./config/database.js');
const User = require('./model/user.js');
const bcrypt = require('bcrypt');
const { validation } = require('./validator/validator.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth_middleware.js');

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

app.use(cookieParser());

// Creating and storing the user information into the DB. 

app.post('/signup', async (req, res) => {


    try {
        validation(req.body);
        const { password } = req.body; // write now pwd is not hashed from the client side.

        let hashPassword = await bcrypt.hash(password, 10);



        //  Creating the new instance from the user model and data which pass from the end user ( like UI, postman );
        const userDetails = new User({
            ...req.body,
            password: hashPassword
        });
        await userDetails.save();
        res.send("user add done");  // sending the request to the client who made the request.
    } catch (error) {
        console.log('test3656565', error?.errorResponse);

        res.status(400).send(error.message);
    }

});

// login api,
app.post('/login', async (req, res) => {
    // backend level authetication 
    const userFound = await User.findOne({ emailId: req.body.emailId });
    try {
        console.log('userFound', userFound);
        if (!userFound) throw new Error("Invalid Credential");
        const isPasswordValid = await bcrypt.compare(req.body.password, userFound.password);
        if (!isPasswordValid) {
            throw new Error("Password is not valid");
        } else {
            // sending cookie along side after login
            const token = jwt.sign({ _id: userFound._id }, '1234D');
            res.cookie('token', token);
            res.send("Login successfully");
        }

    } catch (error) {
        res.status(400).send("Error occured", error);

    }
});

// get the profile

app.get('/profile', async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies) {
            res.status(400).send('Invalid credential ');
        }
        let isValideTokken = await jwt.verify(cookies.token, '1234D');
        const loggedInUser = await User.findById({ _id: isValideTokken._id });

        if (loggedInUser) {
            res.send(loggedInUser);
        } else {
            res.status(404).send('user not found');
        }

    } catch (error) {
        res.status(400).send('user not found');

    }
});

// Filter the user with the emailId or else. by using the find method of the mongoose. 
app.get('/user', async (req, res) => {
    const userEmail = req.body.email;
    console.log('useremail', userEmail);
    try {
        const user = await User.findOne({ emailId: userEmail });
        if (user || user.length > 0) {
            res.send(user);
        } else {
            res.status(404).send("User not found");

        }
    } catch (error) {
        console.log('test000000', error);

        res.status(400).send("Error occured", error.message);
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
app.delete('/user_delete', async (req, res) => {
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

app.patch('/user_update/:userId', async (req, res) => {
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



