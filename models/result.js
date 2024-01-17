const mongoose = require('mongoose')
// const validator = require('validator')

const resultsSchema = new mongoose.Schema({
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
      type: String,
      trim: true,
      required: true
    },
    user_result: {
      type: Boolean,
      trim: true,
      required: true
    }
  }]
})

const Results = mongoose.model('results', resultsSchema)

module.exports = Results
