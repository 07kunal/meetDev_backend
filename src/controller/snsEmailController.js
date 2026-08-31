const snsEmailController = {
    snsNotification: async (req, res) => {
        console.log('req--sns', req);
        res.status(200).json({
            message: "Email sent successfully"
        });
    }
};

module.exports = snsEmailController;