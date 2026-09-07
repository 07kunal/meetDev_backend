const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");
const fs = require('node:fs');
const handlebars = require('handlebars');
const path = require('path');

const createSendEmailCommand = (toAddress, fromAddress,subject,body) => {
    const templatePath = path.join(__dirname, '..', 'emails', 'sendEmailtemplate.html');
    const htmlSource = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(htmlSource);

    const dynamicData = {
        recipientName: "Alex",
        senderName: "Kunal gautam",
        senderEmail: "Support@meetdev.co.in",
        requestMessage:"Hi can you accept the request" || body
    };
    const finalHtml = compiledTemplate(dynamicData);
    return new SendEmailCommand({
        Destination: {
            /* required */
            CcAddresses: [
                /* more items */
            ],
            ToAddresses: [
                toAddress,
                /* more To-email addresses */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: finalHtml,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "Please read it carefull.",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject || "EMAIL_SUBJECT",
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};

const run = async (subject,body) => {
    const sendEmailCommand = createSendEmailCommand(
        "kunalgautam200@outlook.com",
        "support@meetdev.co.in",
        subject,
        body
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            /** @type { import('@aws-sdk/client-ses').MessageRejected} */
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };