const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../model/user');
const { validation } = require('../utils/validator');
const { userAuth } = require('../middlewares/auth_middleware');

// Creating and storing the user information into the DB. 
authRouter.post('/signup', async (req, res) => {
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


// login api,
authRouter.post('/login', async (req, res) => {
    try {
        const userFind = await User.findOne({ emailId: req.body.emailId });
        if (!userFind) throw new Error('User does not exit');
        let isPasswordValid = await userFind.decrptedPwd(req.body.password);
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

// logout api
authRouter.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ logout: true, message: 'User logout successfully' });
    } catch (error) {
        req.status(500).json({ error: error.message });
    }
});

// update forget password
authRouter.put('/resetPassword', userAuth, async (req, res) => {
    try {
        // Check old password
        let userFound = req.user;
        const isOldPasswordValid = await userFound.decrptedPwd(req.body.oldPassword);
        if (!isOldPasswordValid) throw new Error('Old password is not valid');
        // update password
        validation(req.body);
        const salt = bcrypt.genSaltSync(10);
        const hashNewPassword = bcrypt.hashSync(req.body.newPassword, salt);
        userFound['password'] = hashNewPassword;
        userFound.save();
        // save the changes
        res.status(200).json({ message: 'Password has been updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

module.exports = authRouter;