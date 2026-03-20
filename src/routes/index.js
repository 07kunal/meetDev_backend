const express = require('express');
const authRouter = require('./authRoutes');
const profileRouter = require('./profileRoutes');
const userRouter = require('./usersRouters');
const connectionRouter = require('./connectionRoutes');
const indexRouter = express.Router();

indexRouter.use('/', authRouter);
indexRouter.use('/', profileRouter);
indexRouter.use('/', userRouter);
indexRouter.use('/',connectionRouter);

module.exports = indexRouter;