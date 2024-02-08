// user model with mongodb

// const mongoose = require('mongoose')
// const validator = require('validator')
// const moment = require('moment')

// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     trim: true,
//     required: true,
//     // unique: true,
//     validate: {
//       validator: validator.isEmail,
//       message: 'Please provide a valid email'
//     }
//   },
//   gender: [{
//     _id: {
//       type: Number,
//       required: true,
//       trim: true
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true
//       // enum: ['teacher', 'student', 'admin']
//     }
//   }],
//   DOB: {
//     type: String,
//     required: true,
//     validate: {
//       validator: (value) => {
//         const formattedDate = moment(value, 'DD/MM/YYYY', true) // Parse date in DD/MM/YYYY format
//         return formattedDate.isValid()
//       },
//       message: 'Please provide a valid date in DD/MM/YYYY format for DOB'
//     }
//   },
//   mobileNumber: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true,
//     validate: {
//       validator: (value) => {
//         if (!validator.isMobilePhone(value, 'en-IN', { strictMode: false })) {
//           return false
//         }
//         return true
//       },
//       message: 'Please provide a valid mobile number'
//     }
//   },
//   // OTP:{
//   //     type: Number,
//   //     // required: true
//   // },
//   profession: [{
//     _id: {
//       type: Number,
//       required: true,
//       trim: true
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true
//       // enum: ['teacher', 'student', 'admin']
//     }
//   }],
//   user_id: {
//     type: Number,
//     unique: true
//   },
//   tokens: [{
//     token: {
//       type: String,
//       required: true
//     }
//   }]
// }, {
//   timestamps: false
// })

// userSchema.pre('save', async function (next) {
//   // Check if the user already has a userId
//   if (!this.user_id) {
//     // Generate a unique userId (e.g., a random alphanumeric string)
//     let generatedUserId
//     let isUnique = false

//     while (!isUnique) {
//       generatedUserId = generateUserId() // Implement your userId generation logic
//       // Check if the generated userId is unique in the database
//       const existingUser = await this.constructor.findOne({ userId: generatedUserId })

//       if (!existingUser) {
//         isUnique = true
//       }
//     }

//     this.user_id = generatedUserId
//   }

//   next()
// })

// function generateUserId () {
//   const minUserId = 1000
//   const maxUserId = 9999
//   return Math.floor(Math.random() * (maxUserId - minUserId + 1)) + minUserId
// }

// const User = mongoose.model('user', userSchema)

// module.exports = User

// user model with Sequelize

const { DataTypes } = require('sequelize')

const sequelize = require('../db/dbConnect')

const User = sequelize.define('User', {
  // Define user model fields here
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  gender: {
    type: DataTypes.JSON(),
    allowNull: false
  },
  DOB: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isMobilePhone: {
        args: ['en-IN'],
        msg: 'Please provide a valid mobile number'
      }
    }
  },
  profession: {
    type: DataTypes.JSON(),
    allowNull: false
  },
  userProfile: {
    type: DataTypes.STRING
  },
  tokens: {
    type: DataTypes.STRING
    // defaultValue: []
  }
}, {
  timestamps: false
})

module.exports = User
