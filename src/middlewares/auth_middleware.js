const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

// Created the logic to authenticate the admin. 
let userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) throw new Error('Invalid token');
        const decodedObj = jwt.verify(token, "TEST123");
        const isUserExit = await User.findById(decodedObj._id);
        if (!isUserExit) throw new Error('User not found');

        // setting the req.user with user data
        req.user = isUserExit;
        next();

    } catch (error) {
        if (!token) {
            res.status(401).json({
                status: 401,
                message: error.message
            });
        } else {
            res.status(404).json({
                status: 404,
                message: error.message
            });

        }
    }
}
module.exports = {
    userAuth
}