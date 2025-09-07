const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        validate: (value) => {
            if (value.trim().length < 3) throw new Error('Name should be greater then 3 character');
        },
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value)=>{
            if(!validator.isEmail(value)) throw new Error('Email Address is inValid');
        }
    },
    password: {
        type: String,
   
    },
    age: {
        type: Number,
        min: [0, 'Price cannot be negative.'], // Value must be >= 0
        max: [100, 'Price cannot exceed 1000.'],
    },
    gender: {
        type: String,
        required: true,
        validate: (value) => {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error('Gender is not valid');
            }

        }
    },
    photoURL: {
        type: String,
        default: 'https://www.google.com/imgres?q=Image&imgurl=https%3A%2F%2Fletsenhance.io%2Fstatic%2F73136da51c245e80edc6ccfe44888a99%2F396e9%2FMainBefore.jpg&imgrefurl=https%3A%2F%2Fletsenhance.io%2F&docid=-t22bY2ix3gHaM&tbnid=g8Tzlw0sX4Aj_M&vet=12ahUKEwikgIHs_5mPAxWpafUHHZ8UEg8QM3oECBYQAA..i&w=1280&h=720&hcb=2&ved=2ahUKEwikgIHs_5mPAxWpafUHHZ8UEg8QM3oECBYQAA'
    },
    skills: {
        type: Array,
    }
}, { timestamps: true })
const User = mongoose.model('User', userSchema);
module.exports = User;