const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = process?.env?.AWS_REGION;
const AWS_KEY = process?.env?.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process?.env?.AWS_SECRET_KEY;

// Create SES service object.
const sesClient = new SESClient({ region: REGION,
    credentials: {
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  }
});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]