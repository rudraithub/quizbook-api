const mongoose = require('mongoose')
const validator = require('validator')
const moment = require('moment')

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
        // unique: true,
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
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                const formatedDate = moment(value, 'DD/MM/YYYY', true)

                return formatedDate.isValid()
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
    // OTP:{
    //     type: Number,
    //     // required: true
    // },
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
    }}],
    user_id: {
        type: Number,
        unique: true
    }
},{
    timestamps: false
})

userSchema.pre('save', async function (next) {
    // Check if the user already has a userId
    if (!this.user_id) {
        // Generate a unique userId (e.g., a random alphanumeric string)
        let generatedUserId;
        let isUnique = false;
        
        while (!isUnique) {
            generatedUserId = generateUserId(); // Implement your userId generation logic
            // Check if the generated userId is unique in the database
            const existingUser = await this.constructor.findOne({ userId: generatedUserId });
            
            if (!existingUser) {
                isUnique = true;
            }
        }
        
        this.user_id = generatedUserId;
    }

    
    next();
});


function generateUserId() {
    const minUserId = 1000;
    const maxUserId = 9999;
    return Math.floor(Math.random() * (maxUserId - minUserId + 1)) + minUserId;
}


const User = mongoose.model('user', userSchema)

module.exports = User