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
            trim:true
        },
        img: {
            type: String,
            default:"error"
        }
    }]
})


const Subject = mongoose.model('subData', standardSchema)

module.exports = Subject