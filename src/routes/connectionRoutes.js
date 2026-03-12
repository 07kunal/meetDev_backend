const express = require('express');
const connectionRouter = express.Router();
const { userAuth } = require('../middlewares/auth_middleware');
const connectionRequest = require('../controller/connectionRequestController');

const connectionRequestObj = new connectionRequest();
connectionRouter.post('/request/:status/:userId',userAuth,connectionRequestObj.sendingConnectionRequest);

module.exports = connectionRouter;