const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

// Created the logic to authenticate the admin. 
let userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error('Invalid token');
        const decodedObj = jwt.verify(token, "TEST123");
        const isUserExit = await User.findById(decodedObj._id);
        if (!isUserExit) throw new Error('Invalid token');

        console.log('Testing_middleware');
        // setting the req.user with user data
        req.user = isUserExit;
        next();

    } catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports = {
    userAuth
}