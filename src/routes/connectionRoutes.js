const express = require('express');
const connectionRouter = express.Router();
const { userAuth } = require('../middlewares/auth_middleware');
const connectionRequest = require('../controller/connectionRequestController');


const connectionRequestObj = new connectionRequest();
connectionRouter.post('/request/send/:status/:userId', userAuth, connectionRequestObj.sendingConnectionRequest);
connectionRouter.post('/request/review/:status/:requestId', userAuth, connectionRequestObj.reviewingConnectionRequest);
connectionRouter.post('/request/connectedUser/:status/:requestId', userAuth, connectionRequestObj.rejectingConnectedUsers);
connectionRouter.delete('/deleteRequest/:requestId', userAuth, connectionRequestObj.deleteConnectionRequest);


module.exports = connectionRouter;