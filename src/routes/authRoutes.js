const express = require('express');
const authRouter = express.Router();
const { userAuth } = require('../middlewares/auth_middleware');
const authController = require('../controller/authController');

// Creating and storing the user information into the DB. 
authRouter.post('/signup', authController.userSignup);


// login api,
authRouter.post('/login', authController.userLogin);

// logout api
authRouter.post('/logout', authController.userLogout);

// update forget password
authRouter.put('/resetPassword', userAuth,authController.userResetPassword);

module.exports = authRouter;