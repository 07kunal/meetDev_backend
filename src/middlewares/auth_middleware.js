const jwt = require('jsonwebtoken');
const User = require('../model/user');

// Created the logic to authenticate the admin. 
let userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Invalid Credential');
        }
        const isValideObj = await jwt.verify(token, '1234D');
        const loggedInUser = await User.find({ _id: isValideObj._id });
        console.log('Testing_middleware');
        if (loggedInUser) {
            req.user = loggedInUser;
            next();
        } else {
          throw new Error('Admin is not autharised');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports = {
    userAuth
}