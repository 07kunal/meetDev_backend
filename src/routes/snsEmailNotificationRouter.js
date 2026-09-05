const express = require('express');
const snsEmailRouter = express.Router();
const snsEmailController = require('../controller/snsEmailController');

snsEmailRouter.post('/webhook/ses', snsEmailController.snsNotification);
module.exports = snsEmailRouter;