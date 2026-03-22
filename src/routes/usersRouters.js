const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth_middleware');
const userController = require('../controller/userController');

userRouter.get('/feed', userAuth,userController.userFeeds)
userRouter.get('/user/pendingRequest', userAuth,userController.userPendingRequest);
userRouter.get('/user/connections', userAuth,userController.userConnections);
userRouter.get('/user/requestHistory', userAuth,userController.userRequestHistory);




module.exports = userRouter;