const { mongoose, Schema } = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/*
Added the real time validation into the database before user add anything 
beyound exceptation. Which is called the data sanetization. 
- moongse provide the inbuild method which made is easy to handle this senetaization. 
*/
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'User firstName is required'],
        validator: (value) => {
            if (value.trim().length < 3) throw new Error("firstName should be grater then 3 characters");
        },
    },
    lastName: {
        type: String,
        required: [true, 'User lastName required'],
        validator: (value) => {
            if (value.trim().length < 3) throw new Error("lastName should be grater then 3 characters");
        },
        minLength: [3, 'lastName should be greater then 3character'],
        maxLength: [30, 'lastName should not be greater then 30 character']

    },
    gender: {
        type: String,
        required: [true, 'Please mention the Gender'],
        validator: (value) => {
            if (!['Male', 'Female', 'others'].includes(value)) throw new Error('Gender is not valid');
        }

    },
    age: {
        type: Number,
        required: [true, 'Please Enter your Name'],
        min: [0, 'Age cannot be zero'],
        max: [120, 'Age should be not be greater then 120 character']

    },
    emailId: {
        type: String,
        required: true,
        index: true,
        unique: true,
        sparse: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) throw new Error('Email Address is inValid');
        }

    },
    education: {
        type: Array,
        required: [true, 'Atleast one level education is required'],
        validate: (value) => {
            if (value.length === 0) throw new Error('Should atleast give one level of education');
        }

    },
    address: {
        type: String,
        required: true,


    },
    profilePic: {
        type: String,
        default: 'https://www.google.com/imgres?q=Image&imgurl=https%3A%2F%2Fletsenhance.io%2Fstatic%2F73136da51c245e80edc6ccfe44888a99%2F396e9%2FMainBefore.jpg&imgrefurl=https%3A%2F%2Fletsenhance.io%2F&docid=-t22bY2ix3gHaM&tbnid=g8Tzlw0sX4Aj_M&vet=12ahUKEwikgIHs_5mPAxWpafUHHZ8UEg8QM3oECBYQAA..i&w=1280&h=720&hcb=2&ved=2ahUKEwikgIHs_5mPAxWpafUHHZ8UEg8QM3oECBYQAA'

    },
    skills: {
        type: Array,
        required: true

    },
    password: {
        type: String,
        required: true

    }
},
    {
        virtuals: {
            fullName: {
                get() {
                    return this.firstName +
                        ' ' + this.lastName;
                }
            }
        }
    },
    {
        timestamps: true
    }
);

/* 
This is the another advantage of using mongoose, In this when the model has created then mongoose provide another methods (actual method ) through this different method can be form. These method later use in the API method. 

*/
userSchema.methods.getJWT = async function () {
    let user = this;
    const token = jwt.sign({
        _id: user._id
    }, 'TEST123', { expiresIn: '1h' });
    return token;
}
// schema method for bcrypt the password. 
userSchema.methods.decrptedPwd = async function (userPwd) {
    let user = this;
    const isPasswordValid = await bcrypt.compare(userPwd, user.password);
    return isPasswordValid;

}
// Creating the model through which multiple instance will create. 
const User = mongoose.model('User', userSchema);
module.exports = {
    User: User
}

