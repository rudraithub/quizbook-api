const express = require('express')

const Subject = require('../models/std')
require('../chapter.json')

const router = express.Router()
const chapterData = require('./chapter')
const { default: mongoose } = require('mongoose')
const question = require('./question')

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
        }, {
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
        }, {
            "id": 6,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 2
    }, {
        "std": "8",
        "subject": [{
            "id": 7,
            "subjectName": "maths",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 8,
            "subjectName": "gujarati",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 9,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 3
    }, {
        "std": "9",
        "subject": [{
            "id": 10,
            "subjectName": "maths",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 11,
            "subjectName": "gujarati",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 12,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 4
    }, {
        "std": "10",
        "subject": [{
            "id": 13,
            "subjectName": "maths",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 14,
            "subjectName": "gujarati",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }, {
            "id": 15,
            "subjectName": "english",
            "img": "https://www.freepik.com/free-vector/cartoon-math-concept-background_4473415.htm#query=math%20book&position=13&from_view=keyword&track=ais"
        }],
        "id": 5
    }
]

router.get('/std', async (req, res) => {
    try {
        const isStd = await Subject.find()
        if (isStd.length > 0) {
            return res.status(200).json({
                status: 200,
                data: isStd
            })
        }

        const createData = []

        for (const stdData of standard) {
            const subData = new Subject(stdData)
            await subData.save()
            await createData.push[subData]
        }
        return res.status(201).json({
            status: 200,
            data: createData
        })
    } catch (error) {
        res.status(400).json(error.message)
    }
})


// router.get('/std', async(req, res) => {
//     try {
//         const subData = await Subject.create(standard)
//         res.json(subData)
//     } catch (error) {
//         res.status(400).json(error.message)
//     }
// })

router.get('/chapter', async (req, res) => {
    res.json(chapterData)
})

router.get('/std/:stdId/subject/:subId/chapter', async (req, res) => {
    const stdId = req.params.stdId
    const subId = req.params.subId

    const std = standard.find((p) => p.id === parseInt(stdId))

    if (!std) {
        return res.status(400).json({
            status: 400,
            message: "standard not found"
        })
    }

    const sub = std.subject.find((p) => p.id === parseInt(subId))

    if (!sub) {
        return res.status(400).json({
            status: 400,
            message: "standard not found"
        })
    }

    const chapters = chapterData[stdId] && chapterData[stdId][subId]

    console.log(chapters)

    if (!chapters || chapters.length === 0) {
        return res.status(400).json({
            status: 400,
            message: 'chapter data not found'
        })
    }

    //     res.json({
    //     status: 200, 
    //     message: chapters
    // })


    try {
        const db = mongoose.connection
        const collection = db.collection('chapter')

        // await collection.deleteMany()

        const isChapter = await collection.find({ stdId, subId }).toArray()
        console.log("isChapter:", isChapter)

        if (!isChapter) {
            // Insert chapters into the database
            await collection.insertMany(chapters);
        }

        // const storedData = await collection.find({ stdId, subId }).toArray();

        // if (storedData.length === 0) {
        //     res.status(400).json({
        //         status: 400,
        //         message: 'data not found',
        //     });
        // } else {
        //     res.json({
        //         status: 200,
        //         data: storedData,
        //     });
        // }
        // await collection.insertMany(data)

        res.json({
            status: 200,
            data: chapters
        })

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        })
    }

})


router.get('/questions', async (req, res) => {
    res.json(question)
})


router.get('/chapter/:chapterId/questions', async (req, res) => {
    const chapterId = req.params.chapterId

    // const chapter = chapterData.find((p) => p.id === chapterId)
    const chapter = chapterData[chapterId]

    if(!chapter){
        return res.status(400).json({
            status: 400,
            message: 'chapter not found'
        })
    }

    const qData = question[chapterId]
    // const qData = question[chapterId] || []

    // if (qData.length === 0) {
    //     return res.status(400).json({
    //         status: 400,
    //         message: 'No questions found for the specified chapter'
    //     });
    // }

    if (!qData) {
        return res.status(404).json({
            status: 404,
            message: 'Chapter not found',
        });
    }

    // console.log(qData)

    res.json({
        status: 200,
        data: qData
    })

})

module.exports = router
