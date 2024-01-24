const mongoose = require('mongoose')
// const validator = require('validator')

const resultsSchema = new mongoose.Schema({
<<<<<<< HEAD
    stdid: {
        type: Number,
        required: true,
        trim: true
    },
    subid: {
        type: Number,
        required: true,
        trim: true
    },
    chapterid: {
        type: Number,
        required: true,
        trim: true
    },
    questions: [
        {
            queid: {
                type: Number,
                required: true,
                trim: true
            },
            user_answer: {
                type: String,
                required: true,
                trim: true
            },
            user_result: {
                type: Boolean,
                required: true,
                trim: true
            }
        }
    ]
=======
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  stdid: {
    type: Number,
    trim: true,
    required: true
  },
  subid: {
    type: Number,
    trim: true,
    required: true
  },
  chapterid: {
    type: Number,
    trim: true,
    required: true
  },
  questions: [{
    queid: {
      type: Number,
      trim: true,
      required: true
    },
    user_answer: {
      type: Number,
      trim: true,
      required: true
    },
    user_result: {
      type: Boolean,
      trim: true,
      required: true
    }
  }]
>>>>>>> 4545e8ac478fdfd9760198bdd04cf721bb6e0bc1
})

const Results = mongoose.model('results', resultsSchema)

module.exports = Results
