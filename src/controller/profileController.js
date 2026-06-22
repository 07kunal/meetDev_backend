const { User } = require('../model/user');
const { validateUpdateData } = require('../utils/validator');

const profileController = {
    getProfile: async (req, res) => {
        try {
            let userFind = req.user;
            const { firstName, lastName, gender, age, emailId, education, address, profilePic, skills } = userFind;
            // console.log('userDATA',userData);
            res.status(200).json({
                status: true,
                data: { firstName, lastName, gender, age, emailId, education, address, profilePic, skills }
            });
        } catch (error) {
            res.status(400).json({ "Error": error.message });

        }
    },
    deleteProfile: async (req, res) => {
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

    },
    editProfile: async (req, res) => {
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
    }
}

module.exports = profileController;