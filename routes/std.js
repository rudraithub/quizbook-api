const express = require('express')
const cors = require('cors')
const Subject = require('../models/std')
require('../chapter.json')

const router = express.Router()
const chapterData = require('./chapter')
const { default: mongoose } = require('mongoose')
const question = require('./question')
const standard = require('./standard')


router.use(cors())
router.get('/std', async (req, res) => {
    try {
        const isStd = await Subject.find()
        // res.set({
        //     'Content-Type': 'application/json'
        // })
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
            data: createData,
            message: 'success!!'
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

router.get('/std/:stdid/subject/:subid/chapter', async (req, res) => {
    const stdId = req.params.stdid
    const subId = req.params.subid

    // res.set({
    //     'Content-Type': 'application/json'
    // })

    const std = standard.find((p) => p.stdid === parseInt(stdId))

    if (!std) {
        return res.status(400).json({
            status: 400,
            message: "standard not found"
        })
    }

    const sub = std.subject.find((p) => p.subid === parseInt(subId))

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
            data: chapters,
            message: 'success!!'
        })

    } catch (error) {
        // res.set({
        //     'Content-Type': 'application/json'
        // })
        res.status(400).json({
            status: 400,
            message: error.message
        })
    }

})


router.get('/questions', async (req, res) => {
    res.json(question)
})


router.get('/chapter/:chapterid/questions', async (req, res) => {
    const chapterId = req.params.chapterid

    // const chapter = chapterData.find((p) => p.id === chapterId)
    const chapter = chapterData[chapterId]
    // res.set({
    //     'Content-Type': 'application/json'
    // })
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
        data: qData,
        message: 'success!!'
    })

})

module.exports = router
