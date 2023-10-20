const mongoose = require('mongoose')
const validator = require('validator')

const resultsSchema = new mongoose.Schema({
    chapter_id: {
        type: Number,
        required: true,
    },
    sub_id: {
        type: Number,
        required: true
    },
    total_que: {
        type: Number,
        required: true
    },
    right_que: {
        type: Number,
        required: true
    }
})

const Results = mongoose.model('results', resultsSchema)

module.exports = Results

