const express = require('express')
const Results = require('../models/result')
const standard = require('./standard')
const question = require('./question')
const chapterData = require('./chapter')
const cors = require('cors');

const router = express.Router()

router.use(cors())

router.post('/results', async (req, res) => {
    try {
        const { stdid, subid, chapterid, questions } = req.body

        const stdId = standard.find((p) => p.stdid === stdid)
        if (!stdId) {
            return res.status(400).json({
                status: 'fails',
                message: "No standard found"
            })
        }

        const subId = stdId.subject.find((p) => p.subid === subid)

        if (!subId) {
            return res.status(400).json({
                status: 'fails',
                message: "No subject found"
            })
        }

        const chapterIdArray = chapterData[stdid] && chapterData[stdid][subid]
        const chapterId = chapterIdArray && chapterIdArray.find((p) => p.chapterid === chapterid)

        if (!chapterId) {
            return res.status(400).json({
                status: 'fails',
                message: "No chapter found"
            })
        }

        const resultQuestion = questions.map(({ queid, user_answer, user_result }) => {
            const queArr = question[chapterid]
            const queData = queArr && queArr.find((p) => p.queid === queid)

            if (!queData) {
                return res.status(400).json({
                    status: 'fails',
                    message: "No question found"
                })
            }

            return {
                queid: queData.queid,
                user_answer,
                user_result
            }

        })


        const result = new Results({
            stdid: stdId.stdid,
            subid: subId.subid,
            chapterid: chapterId.chapterid,
            questions: resultQuestion,
        })


        await result.save()
        const totalRightQuestions = resultQuestion.filter(question => question.user_result === true).length
        const totalWrongQuestions = resultQuestion.length - totalRightQuestions
        // console.log(totalRightQuestions)
        // console.log(totalWrongQuestions)

        if (!result) {
            return res.status(400).json({
                status: 400,
                message: 'no result found!'
            })
        }

        // console.log(result)
        res.set({
            'Content-Type': 'application/json'
        })
        res.json({
            status: 200,
            data: {
                ...result.toObject(),
                totalRightQuestions,
                totalWrongQuestions
            },
            message: 'success!!'
        })
    } catch (e) {
        res.status(400).json({
            status: 400,
            message: e.message
        })
    }
})

router.get('/results', async (req, res) => {
    try {
        const result = await Results.find()
        // console.log(result)
        const allQuestions = result.flatMap(question => question.questions)
        // console.log(allQuestions)

        const totalRightQuestions = allQuestions.filter((question)=> {
            return question.user_result === true
        }).length

        const totalWrongQuestions = allQuestions.length - totalRightQuestions

        // console.log(totalRightQuestions)
        // console.log(totalWrongQuestions)
        res.set({
            'Content-Type': 'application/json'
        })
        res.json({
            status: 200,
            data: {
                totalRightQuestions,
                totalWrongQuestions
            },
            message: 'success!!'
        })
    } catch {
        res.status(400).json({
            status: 400,
            message: "please complete quiz"
        })
    }
})

module.exports = router