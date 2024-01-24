const express = require('express')
const History = require('../models/history')
const standard = require('./standard')
const question = require('./question')
const chapterData = require('./chapter')

const cors = require('cors')
// const User = require('../models/user')
const Results = require('../models/result')
const auth = require('../middleware/auth')
const auth = require('../middleware/auth')

const router = express.Router()

router.use(cors())

router.post('/history', auth, async (req, res) => {
  try {
    // const { stdID, subID, chapterID, questions } = req.body;
    const userID = req.user._id
    const results = await Results.find({ userID })

    if (!results || results.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Oops! It seems like there is no result data available for your account.'
      })
    }

    const historyData = []

    for (const result of results) {
      const stdid = result.stdid
      const subid = result.subid
      const chapterid = result.chapterid
      const questions = result.questions

      const std = standard.find((s) => s.stdid === stdid)

      if (!std) {
        console.error('std not found')
        return res.status(404).json({
          status: 404,
          message: 'Standard not found!'
        })
      }

      const sub = std.subject.find((s) => s.subid === subid)
      if (!sub) {
        return res.status(404).json({
          status: 404,
          message: 'subject not found!'
        })
      }

      const chapters = chapterData[stdid] && chapterData[stdid][subid]
      const chap = chapters.find((ch) => ch.chapterid === chapterid)

      if (!chap) {
        return res.status(404).json({
          status: 404,
          message: 'chapter not found!'
        })
      }

      const history = new History({
        stdID: std.stdid,
        std: std.std,
        subID: sub.subid,
        subjectName: sub.subjectName,
        chapterID: chap.chapterid,
        chapterName: chap.content,
        teacher: chap.teacher,
        questions: questions.map((resultItem) => {
          const queDataItem = question.filter(q => q.chapterid === chapterid).find((que) => que.queid === resultItem.queid)
          // const queDataItem = question.find(q => q.chapterid === chapterid && q.queid === resultItem.queid);

          // console.log(queDataItem)

          return {
            questionID: resultItem.queid,
            questionName: queDataItem.question,
            option: queDataItem.Option,
            rightAnswer: queDataItem.rightAns,
            user_Ans: resultItem.user_answer || null,
            user_Result: resultItem.user_result
          }
        })
      })

      historyData.push(history)
    }

    await History.insertMany(historyData)

    res.status(200).json({
      status: 200,
      data: historyData,
      message: 'success!!'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 500,
      message: error.message
    })
  }
})

module.exports = router
