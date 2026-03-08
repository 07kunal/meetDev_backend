const express = require('express');
const profileRouter = express.Router();
const { User } = require('../model/user');
const { userAuth } = require('../middlewares/auth_middleware');
const { validateUpdateData } = require('../utils/validator');

// get the profile

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).json({ "Error": error.message });

    }
});
// Creating Delete api that that delete the user from the DB using the _id
profileRouter.delete('/user_delete', userAuth, async (req, res) => {
    const userId = req?.body?.userId;
    try {
        const deletedUser = await User.findByIdAndDelete({ _id: userId });
        if (deletedUser) {

            res.send("Selected user deleted");
        } else {
            res.status(400).send("Error occured");

        }
    } catch (error) {
        res.status(400).json({ "Error": error.message });

    }

});

// Update the Data for the particular UserId

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        validateUpdateData(req);

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.status(200).json({
            message: 'User data update successfully',
            data: loggedInUser
        });

    } catch (error) {
        res.status(400).json({ error: error.message });

    }
});
module.exports = profileRouter;