const express = require('express')

const Subject = require('../models/std')
require('../subject.json')

const router = express.Router()


const standard = [
    {
        "std": "6",
        "subject": [{
            "id": 1,
            "subjectName": "maths",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 2,
            "subjectName": "gujarati",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        },{
            "id": 3,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 1
    },
    {
        "std": "7",
        "subject": [{
            "id": 4,
            "subjectName": "maths",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 5,
            "subjectName": "gujarati",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        },{
            "id": 6,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 2
    },{
        "std": "8",
        "subject": [{
            "id": 7,
            "subjectName": "maths",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 8,
            "subjectName": "gujarati",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        },{
            "id": 9,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 3
    },{
        "std": "9",
        "subject": [{
            "id": 10,
            "subjectName": "maths",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 11,
            "subjectName": "gujarati",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        },{
            "id": 12,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 4
    },{
        "std": "10",
        "subject": [{
            "id": 13,
            "subjectName": "maths",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 14,
            "subjectName": "gujarati",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        },{
            "id": 15,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 5
    }
]

    router.get('/std', async(req, res) => {
        try {
            const isStd = await Subject.find()
            if(isStd.length > 0){
               return res.status(200).json({
                    status: 200,
                    data: isStd
                })
            }

            const createData = []

            for(const stdData of standard){
                const subData = new Subject(stdData)
                await subData.save()
                await createData.push[subData]
            }
            return res.status(201).json({
                status:200,
                data: createData
            })
        } catch (error) {
            res.status(400).json({
                status:400,
                message: error.message
            })
        }
    })



module.exports =router