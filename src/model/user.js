const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        required: true,
        validate: (value) => {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error('Gender is not valid');
            }

        }},
        photoURL: {
            type: String,
            default: 'https://www.google.com/imgres?q=Image&imgurl=https%3A%2F%2Fletsenhance.io%2Fstatic%2F73136da51c245e80edc6ccfe44888a99%2F396e9%2FMainBefore.jpg&imgrefurl=https%3A%2F%2Fletsenhance.io%2F&docid=-t22bY2ix3gHaM&tbnid=g8Tzlw0sX4Aj_M&vet=12ahUKEwikgIHs_5mPAxWpafUHHZ8UEg8QM3oECBYQAA..i&w=1280&h=720&hcb=2&ved=2ahUKEwikgIHs_5mPAxWpafUHHZ8UEg8QM3oECBYQAA'
        },
        skils: {
            type: Array,
        }
    })
const User = mongoose.model('User', userSchema);
module.exports = User;