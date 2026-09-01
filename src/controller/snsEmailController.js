const snsEmailController = {
    snsNotification: async (req, res) => {
        console.log('req--sns', req);
        const messageType = req.headers["x-amz-sns-message-type"];

        console.log("SNS Type:", messageType);
        console.log("SNS Body:", req.body);

        if (messageType === "SubscriptionConfirmation") {
            console.log("Confirm this subscription:");
            console.log(req.body.SubscribeURL);
        }

        if (messageType === "Notification") {
            const message = JSON.parse(req.body.Message);

            console.log("SES Event:");
            console.log(message);
        }
        res.status(200).json({
            message: "Email sent successfully"
        });
    }
};

module.exports = snsEmailController;