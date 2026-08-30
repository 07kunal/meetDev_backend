const cron = require('node-cron');
const ConnectionRequestModel = require('../model/connectionRequest');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const sendEmail = require('./sendEmailForConnectionRequest');
cron.schedule('07 18 * * *', async () => {
    console.log('running a task every minute');
    try {
        const yesterday = subDays(new Date(), 0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        // Make sure no repetitive emailId 
        const listOfEmails = [...new Set(pendingRequests.map((req) => req.toUserId.emailId))];
        // Now send the email 
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run("New Connection request pending for " + email + "There are many connection request pending, please visit to meetDev.co.in and review the requests");
            } catch (error) {
                console.log('ERRor while sending the email', error);
            }
        }

    } catch (error) {
        console.log('what is the error', error);
    }


});