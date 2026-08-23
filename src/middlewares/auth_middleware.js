const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

// Created the logic to authenticate the admin. 
let userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) throw new Error('Invalid token');
        const decodedObj = jwt.verify(token, process?.env?.Scret_JWTKey);
        const isUserExit = await User.findById(decodedObj._id);
        if (!isUserExit) throw new Error('User not found');

        // setting the req.user with user data
        req.user = isUserExit;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {

            // CRITICAL: Options MUST match exactly how the cookie was created (except maxAge/expires)
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/' // Ensure the path matches your original cookie configuration
            });

            return res.status(401).json({
                message: 'Session expired. Please log in again.',
                status: 401
            });
        } else {

            res.status(401).json({
                status: 401,
                message: error.message
            });

        }
    }
}
module.exports = {
    userAuth
}