const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    DOB: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => {
                if (!validator.isDate(value, { format: 'DD/MM/YYYY' })) {
                    return false;
                }
                return true;
            },
            message: 'Please provide a valid date in DD/MM/YYYY format for DOB',
        },
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                if (!validator.isMobilePhone(value, 'en-IN', { strictMode: false })) {
                    return false;
                }
                return true;
            },
            message: 'Please provide a valid mobile number',
        },
    },
    profession: [{
        _id:{
            type: Number,
            required:true,
            trim: true
        },
        name:{
        type: String,
        required: true,
        trim: true
        // enum: ['teacher', 'student', 'admin']
    }}]
})



const User = mongoose.model('user', userSchema)

module.exports = User