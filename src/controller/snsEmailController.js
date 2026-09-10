import snsValidator from "sns-validator";


const validator = new snsValidator.MessageValidator();
const snsEmailController = {
  snsNotification: async (req, res) => {
    try {
      console.log("SNS notification received");
      console.log(JSON.stringify(req.body, null, 2));






      // 1. Validate that the message actually came from SNS
      validator.validate(req.body, async (error) => {
        if (error) {
          console.error("Invalid SNS message:", error);
          return res.status(400).send("Invalid SNS message");
        }
        const messageType = req.headers["x-amz-sns-message-type"];
        const snsMessage = JSON.parse(req.body.Message);

        console.log("SNS Type:", messageType);
        console.log("SNS message:", snsMessage);
        /*
        
        After that you'll get the actual SES notification:

{
  "notificationType": "Bounce",
  "mail": {
    "messageId": "010001...",
    "destination": [
      "receiver@example.com"
    ]
  },
  "bounce": {
    "bounceType": "Permanent",
    "bounceSubType": "General",
    "bouncedRecipients": [
      {
        "emailAddress": "receiver@example.com"
      }
    ]
  }
}
        */

        // 2. Handle subscription confirmation
        if (message.Type === "SubscriptionConfirmation") {
          console.log("Confirming SNS subscription...");

          await fetch(message.SubscribeURL);

          console.log("SNS subscription confirmed");

          return res.status(200).send("Subscription confirmed");
        }

        // 3. Handle actual SNS notification
        if (message.Type === "Notification") {
          console.log("SNS notification received");

          const sesMessage = JSON.parse(message.Message);

          console.log("SES event:");
          console.log(sesMessage);

          return res.status(200).send("Notification received");
        }

        if (message.notificationType === "Bounce") {
          const bouncedRecipients = message.bounce.bouncedRecipients;

          for (const recipient of bouncedRecipients) {
            console.log("Bounced:", recipient.emailAddress);
          }
        }

        return res.status(200).send("OK");
      });
    } catch (error) {
      res.status(500).json({
        message: "Error message:" + error
      })
    }
  }
};

module.exports = snsEmailController;