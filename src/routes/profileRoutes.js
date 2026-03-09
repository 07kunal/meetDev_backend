const express = require('express');
const profileRouter = express.Router();
const { User } = require('../model/user');
const { userAuth } = require('../middlewares/auth_middleware');
const { validateUpdateData } = require('../utils/validator');
const profileController = require('../controller/profileController');

// get the profile
profileRouter.get('/profile', userAuth, profileController.getProfile);

// Creating Delete api that that delete the user from the DB using the _id
profileRouter.delete('/user_delete', userAuth, profileController.deleteProfile);

// Update the Data for the particular UserId

profileRouter.patch('/profile/edit', userAuth, profileController.editProfile);

module.exports = profileRouter;