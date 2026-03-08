const express = require('express');
const authRouter = require('./authRoutes');
const profileRouter = require('./profileRoutes');
const usersFeedRouter = require('./usersFeedRouters');
const indexRouter = express.Router();

indexRouter.use('/', authRouter);
indexRouter.use('/', profileRouter);
indexRouter.use('/', usersFeedRouter);

module.exports = indexRouter;