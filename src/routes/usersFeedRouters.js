const express = require('express');
const usersFeedRouter = express.Router();
const { User } = require('../model/user');
const { userAuth } = require('../middlewares/auth_middleware');

usersFeedRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const usersData = await User.find({});
        if (!usersData) throw new Error('Users data not appear');
        res.status(200).send(usersData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = usersFeedRouter;