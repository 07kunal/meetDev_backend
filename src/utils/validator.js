const validator = require('validator');

const validation = (requestData) => {
    const { firstName, lastName, emailId, password } = requestData;

    if (!firstName || !lastName) {
        throw new Error("Please new enter firstName and lastname");
    }
    if (firstName.length < 4) throw new Error('first name character should be greater then 4 and less then 40 character');
    if (lastName.length < 4 || lastName.length > 40) {
        throw new Error("last name character should be greater then 4 and less then 40 character");
    }
    if (!validator.isEmail(emailId)) throw new Error('Email Address is inValid');
    if (!validator.isStrongPassword(password)) throw new Error('Password is not strong');


}
const validateUpdateData = (req) => {
    const propToUpdate = ['age', 'education', 'profilePic', 'skills', 'education'];
    let reqbodyKeys = Object.keys(req.body);

    const fieldNotAllowedToUpdate = reqbodyKeys.filter((key) => !propToUpdate.includes(key));
    if (fieldNotAllowedToUpdate.length > 0) throw new Error(`Following fields are not allowed to update: ${fieldNotAllowedToUpdate}`);
}

module.exports = { validation, validateUpdateData }
