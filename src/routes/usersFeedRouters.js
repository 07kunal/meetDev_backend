const express = require('express');
const usersFeedRouter = express.Router();
const { User } = require('../model/user');
const { userAuth } = require('../middlewares/auth_middleware');
const userFeedController = require('../controller/userFeedController');

usersFeedRouter.get('/feed', userAuth,userFeedController.userFeeds)

module.exports = usersFeedRouter;