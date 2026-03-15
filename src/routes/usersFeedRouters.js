const express = require('express');
const usersFeedRouter = express.Router();
const { userAuth } = require('../middlewares/auth_middleware');
const userFeedController = require('../controller/userFeedController');

usersFeedRouter.get('/feed', userAuth,userFeedController.userFeeds)
usersFeedRouter.get('/user/pendingRequest', userAuth,userFeedController.userPendingRequest);
usersFeedRouter.get('/user/connections', userAuth,userFeedController.userConnections);


module.exports = usersFeedRouter;