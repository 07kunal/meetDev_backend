const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = process?.env?.AWS_REGION;
// Create SES service object.
const sesClient = new SESClient({ region: REGION});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]