const express = require('express');
const authRouter = require('./authRoutes');
const profileRouter = require('./profileRoutes');
const userRouter = require('./usersRouters');
const connectionRouter = require('./connectionRoutes');
const indexRouter = express.Router();
const snsEmailNotificationRouter = require('./snsEmailNotificationRouter');

indexRouter.use('/', authRouter);
indexRouter.use('/', profileRouter);
indexRouter.use('/', userRouter);
indexRouter.use('/',connectionRouter);
indexRouter.use('/',snsEmailNotificationRouter);

module.exports = indexRouter;