const mongoose = require('mongoose')
// const validator = require('validator')

const historySchema = new mongoose.Schema({
  stdID: {
    type: Number,
    required: true,
    trim: true
  },
  std: {
    type: String,
    trim: true
  },
  subID: {
    type: Number,
    // required: true,
    trim: true
  },
  subjectName: {
    type: String,
    trim: true
  },
  chapterID: {
    type: Number,
    trim: true,
    required: true
  },
  chapterNo: {
    type: Number,
    trim: true
  },
  chapterName: {
    type: String,
    trim: true
  },
  teacher: {
    type: String,
    trim: true
  },
  questions: [{
    questionID: {
      type: Number,
      trim: true,
      required: true
    },
    questionName: {
      type: String,
      trim: true
    },
    option: {
      type: Object
    },
    rightAnswer: {
      type: Number
    },
    user_Ans: {
      type: Number
    },
    user_Result: {
      type: Boolean
    }
  }]
})

const History = mongoose.model('history', historySchema)

module.exports = History
