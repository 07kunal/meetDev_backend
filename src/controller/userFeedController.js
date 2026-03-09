const { User } = require('../model/user');

const userFeedController = {
    userFeeds: async (req, res) => {
        try {
            const usersData = await User.find({});
            if (!usersData) throw new Error('Users data not appear');
            res.status(200).send(usersData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = userFeedController