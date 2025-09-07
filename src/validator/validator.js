const validator = require('validator');

const validation = (requestData) => {
    const { firstName, lastName, emailId, age } = requestData;
    if (!firstName || !lastName) {
        throw new Error("Please new enter firstName and lastname");
    }
    if(!validator.isEmail(emailId)) throw new Error('Email Address is inValid');

}

module.exports = { validation }
