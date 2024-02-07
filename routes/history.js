const express = require('express')
// const standard = require('../routes/standard')
// const chapterData = require('../routes/chapter')
// const question = require('../routes/question')
const cors = require('cors')
const User = require('../models/user')
const Results = require('../models/result')
const auth = require('../middleware/auth')
const History = require('../models/history')
const { Std, Subject } = require('../models/std')
const Chapters = require('../models/chapter')
const Question = require('../models/question')
// const User = require('../models/user')
const router = express.Router()
router.use(cors())

router.get('/history', auth, async (req, res) => {
  try {
    const userID = req.user.id

    const user = await User.findOne({ where: { id: userID } })
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'user not found!'
      })
    }

    const results = await Results.findAll({ where: { userID } })
    // console.log(results)

    if (!results) {
      return res.status(400).json({
        status: 400,
        message: 'Oops! It seems like there is no result data available for your account.'
      })
    }

    const historyData = []

    for (const data of results) {
      const stdid = data.stdid
      const subid = data.subid
      const chapterid = data.chapterid
      const questions = data.questions
      const submitTime = data.submitTime

      const std = await Std.findOne({ where: { stdid } })
      if (!std) {
        return res.status(400).json({
          status: 400,
          message: 'standard not found!'
        })
      }

      const sub = await Subject.findOne({ where: { subid } })
      // Check if sub is fetched correctly
      if (!sub) {
        return res.status(400).json({
          status: 400,
          message: 'subject not found!'
        })
      }

      const chapter = await Chapters.findOne({ where: { chapterid } })
      // Check if chapter is fetched correctly

      if (!chapter) {
        return res.status(400).json({
          status: 400,
          message: 'chapter not found!'
        })
      }

      const totalQuestions = questions.length
      // console.log(totalQuestions)
      let totalRightQuestions = 0
      let totalWrongQuestions = 0

      const questionList = []
      for (const q of questions) {
        const queid = q.queid
        // if (q.user_Result = true) {
        //   totalRightQuestions++
        // } else {
        //   totalWrongQuestions++
        // }
        const question = await Question.findOne({ where: { queid, stdid: std.stdid, subid: sub.subid, chapterid } })

        if (!question) {
          return res.status(400).json({
            status: 400,
            message: 'question not found!'
          })
        }

        if (q.user_answer === question.rightAns) {
          totalRightQuestions++;
        } else {
          totalWrongQuestions++;
        }
        

        questionList.push({
          questionid: q.queid,
          questionName: question.question,
          option: question.Option,
          rightAnswer: question.rightAns,
          user_Ans: q.user_answer || null,
          user_Result: q.user_result
        })
      }

      // console.log(questionList)

      const history = {
        stdid: std.stdid,
        std: std.std,
        subID: sub.subid,
        subjectName: sub.subjectName,
        chapterID: chapter.chapterid,
        chapterName: chapter.content,
        teacher: chapter.teacher,
        questions: questionList,
        submitTime,
        totalQuestions,
        totalRightQuestions,
        totalWrongQuestions
      }

      historyData.push(history)
    }

    await History.bulkCreate(historyData)

    // console.log(historyData)

    res.status(200).json({
      status: 200,
      data: historyData,
      message: 'success!!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

// router.get('/history', auth, async (req, res) => {
//   try {
//     // const { stdID, subID, chapterID, questions } = req.body;
//     const userID = req.user._id
//     const results = await Results.find({ userID })

//     if (!results || results.length === 0) {
//       return res.status(404).json({
//         status: 404,
//         message: 'Oops! It seems like there is no result data available for your account.'
//       })
//     }

//     const historyData = []

//     for (const result of results) {
//       const stdid = result.stdid
//       const subid = result.subid
//       const chapterid = result.chapterid
//       const questions = result.questions

//       const std = standard.find((s) => s.stdid === stdid)

//       if (!std) {
//         console.error('std not found')
//         return res.status(404).json({
//           status: 404,
//           message: 'Standard not found!'
//         })
//       }

//       const sub = std.subject.find((s) => s.subid === subid)
//       if (!sub) {
//         return res.status(404).json({
//           status: 404,
//           message: 'subject not found!'
//         })
//       }

//       const chapters = chapterData[stdid] && chapterData[stdid][subid]
//       const chap = chapters.find((ch) => ch.chapterid === chapterid)

//       if (!chap) {
//         return res.status(404).json({
//           status: 404,
//           message: 'chapter not found!'
//         })
//       }

//       const history = new History({
//         stdID: std.stdid,
//         std: std.std,
//         subID: sub.subid,
//         subjectName: sub.subjectName,
//         chapterID: chap.chapterid,
//         chapterName: chap.content,
//         teacher: chap.teacher,
//         questions: questions.map((resultItem) => {
//           const queDataItem = question.filter(q => q.chapterid === chapterid).find((que) => que.queid === resultItem.queid)
//           // const queDataItem = question.find(q => q.chapterid === chapterid && q.queid === resultItem.queid);

//           // console.log(queDataItem)

//           return {
//             questionID: resultItem.queid,
//             questionName: queDataItem.question,
//             option: queDataItem.Option,
//             rightAnswer: queDataItem.rightAns,
//             user_Ans: resultItem.user_answer || null,
//             user_Result: resultItem.user_result
//           }
//         })
//       })

//       historyData.push(history)
//     }

//     await History.insertMany(historyData)

//     res.status(200).json({
//       status: 200,
//       data: historyData,
//       message: 'success!!'
//     })
//   } catch (error) {
//     // console.error(error.message)
//     res.status(500).json({
//       status: 500,
//       message: "user's history not found!"
//     })
//   }
// })

module.exports = router
