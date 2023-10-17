const express = require('express')

const Subject = require('../models/std')
require('../subject.json')

const router = express.Router()


const standard = {
    "std": "6",
    "subject" : [{
        "subjectName": "maths",
        "img": "a"
    },{
        "subjectName": "gujarati",
        "img": "b"
    }]
}


router.get('/std', async(req, res) => {

    const isstd = await Subject.findOne({std: standard.std})

    if(isstd){
       res.status(400).json({
            status: 'fails',
            error: "stadard alredy exists"
        })
    }else{
        const newSubject = new Subject(standard);
        await newSubject.save();
    
        
        res.json(newSubject)
        console.log(newSubject)
    }



})

module.exports =router