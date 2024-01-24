const mongoose = require('mongoose')

const standardSchema = mongoose.Schema({
  std: {
    type: String,
    required: true,
    trim: true
  },
  subject: [{
    subjectName: {
      type: String,
      required: true,
      trim: true
    },
<<<<<<< HEAD
    subject: [{
        subjectName: {
            type: String,
            required: true,
            trim:true
        },
        img: {
            type: String,
            default:"error"
        },
        subid: {
            type: Number,
            required: true
        }
    }],
    stdid:{
        type:Number,
        required: true
=======
    img: {
      type: String,
      default: 'error'
    },
    subid: {
      type: Number,
      required: true
>>>>>>> 4545e8ac478fdfd9760198bdd04cf721bb6e0bc1
    }
  }],
  stdid: {
    type: Number,
    required: true
  }
})

const Subject = mongoose.model('subData', standardSchema)

module.exports = Subject
