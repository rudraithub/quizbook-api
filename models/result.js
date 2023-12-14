const mongoose = require('mongoose')
const validator = require('validator')

const resultsSchema = new mongoose.Schema({
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
})

const Results = mongoose.model('results', resultsSchema)

module.exports = Results

