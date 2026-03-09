const express = require('express');
const usersFeedRouter = express.Router();
const { userAuth } = require('../middlewares/auth_middleware');
const userFeedController = require('../controller/userFeedController');

usersFeedRouter.get('/feed', userAuth,userFeedController.userFeeds)

module.exports = usersFeedRouter;