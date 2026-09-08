const snsEmailController = {
    snsNotification: async (req, res) => {
        console.log('req--sns', req);
        const messageType = req.headers["x-amz-sns-message-type"];
        const message = JSON.parse(req.body.Message);


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

        if (message.notificationType === "Bounce") {
            const bouncedRecipients = message.bounce.bouncedRecipients;

            for (const recipient of bouncedRecipients) {
                console.log("Bounced:", recipient.emailAddress);
            }
        }
        /*
            await User.updateOne(
  {
    email: recipient.emailAddress
  },
  {
    $set: {
      emailStatus: "BOUNCED"
    }
  }
);
        */
        /*
        if (message.notificationType === "Complaint") {
  const recipients =
    message.complaint.complainedRecipients || [];

  for (const recipient of recipients) {
    await User.updateOne(
      {
        email: recipient.emailAddress
      },
      {
        $set: {
          emailStatus: "COMPLAINED"
        }
      }
    );
  }
}
        */
        res.status(200).json({
            message: "Email sent successfully"
        });
    }
};

module.exports = snsEmailController;