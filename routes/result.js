const express = require('express')
const Results = require('../models/result')
// const standard = require('./standard')
// const question = require('./question')
// const chapterData = require('./chapter')

const cors = require('cors')
// const User = require('../models/user')
const auth = require('../middleware/auth')
const Chapters = require('../models/chapter')
const { Subject, Std } = require('../models/std')
const Question = require('../models/question')
const User = require('../models/user')

const router = express.Router()

router.use(cors())

router.post('/results', auth, async (req, res) => {
  try {
    const { stdid, subid, chapterid, questions } = req.body

    const userID = req.user.id

    const user = await User.findOne({ where: { id: userID } })
    // console.log(user)

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'user not found!'
      })
    }

    const std = await Std.findOne({ where: { stdid } })

    if (!std) {
      return res.status(400).json({
        status: 400,
        message: 'standard not found!'
      })
    }

    const sub = await Subject.findOne({ where: { subid } })

    if (!sub) {
      return res.status(400).json({
        status: 400,
        message: 'subject not found!'
      })
    }

    const chapter = await Chapters.findOne({ where: { chapterid } })
    if (!chapter) {
      return res.status(400).json({
        status: 400,
        message: 'chapter not found!'
      })
    }

    const question = await Question.findAll({ where: { stdid, subid, chapterid } })
    if (!question) {
      return res.status(400).json({
        status: 400,
        message: 'no question found'
      })
    }

    /* eslint-disable camelcase */
    const questionList = []
    for (const { queid, user_answer } of questions) {
      // Fetch question data based on queid

      const questionData = await Question.findOne({ where: { queid } })
      if (!questionData) {
        return res.status(400).json({ status: 400, message: `Question with queid ${queid} not found!` })
      }

      // Determine if user's answer is correct
      const isCorrect = user_answer === questionData.rightAns

      // Construct question object with queid, user_answer, and user_result
      questionList.push({
        queid: questionData.queid,
        user_answer,
        user_result: isCorrect
      })
    }
    /* eslint-enable camelcase */
    // const questionList = questions.map(({queid, user_answer}) => {
    //   const isQestion = question.find((q) => q.queid ===  queid)
    //   if(!isQestion){
    //     return res.status(400).json({
    //       status: 400,
    //       message: 'no question found!'
    //     })
    //   }

    //   const correct = user_answer === isQestion.rightAns

    //   return {
    //     queid: isQestion.queid,
    //     user_answer,
    //     user_result: correct
    //   }
    // })

    const results = Results.build({
      userID: user.id,
      stdid: std.stdid,
      subid: sub.subid,
      chapterid: chapter.chapterid,
      questions: questionList
    })

    await results.save()

    const totalRightQuestions = questionList.filter((qestion) => qestion.user_result === true).length
    const totalWrongQuestions = questionList.length - totalRightQuestions

    const resultsData = {
      userID: results.userID,
      stdid: results.stdid,
      subid: results.subid,
      chapterid: results.chapterid,
      questions: results.questions,
      totalRightQuestions,
      totalWrongQuestions,
      submitTime: results.submitTime
    }

    res.status(200).json({
      status: 200,
      data: resultsData,
      message: 'results'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

// router.post('/results', auth, async (req, res) => {
//   try {
//     const { stdid, subid, chapterid, questions } = req.body
//     const _id = req.user._id

//     const user = await User.findById(_id)

//     if (!user) {
//       return res.status(401).json({
//         status: 401,
//         message: 'User not found'
//       })
//     }

//     const stdId = standard.find((p) => p.stdid === stdid)
//     if (!stdId) {
//       return res.status(400).json({
//         status: 'fails',
//         message: 'No standard found'
//       })
//     }

//     const subId = stdId.subject.find((p) => p.subid === subid)

//     if (!subId) {
//       return res.status(400).json({
//         status: 'fails',
//         message: 'No subject found'
//       })
//     }

//     const chapterIdArray = chapterData[stdId.stdid] && chapterData[stdId.stdid][subId.subid]
//     const chapterId = chapterIdArray && chapterIdArray.find((p) => p.chapterid === chapterid)

//     if (!chapterId) {
//       return res.status(400).json({
//         status: 'fails',
//         message: 'No chapter found'
//       })
//     }

//     /* eslint-disable camelcase */
//     const resultQuestion = questions.map(({ queid, user_answer }) => {
//       const queArr = question.filter((q) => q.chapterid === chapterId.chapterid && q.stdid === stdId.stdid && q.subid === subId.subid)
//       const queData = queArr && queArr.find((p) => p.queid === queid)

//       if (!queData) {
//         return res.status(400).json({
//           status: 'fails',
//           message: 'No question found'
//         })
//       }

//       const isCorrect = user_answer === queData.rightAns
//       console.log(isCorrect)

//       return {
//         queid: queData.queid,
//         user_answer,
//         user_result: isCorrect
//       }
//     })

//     /* eslint-enable camelcase */

//     const result = new Results({
//       userID: user._id,
//       stdid: stdId.stdid,
//       subid: subId.subid,
//       chapterid: chapterId.chapterid,
//       questions: resultQuestion
//     })

//     await result.save()
//     const totalRightQuestions = resultQuestion.filter(question => question.user_result === true).length
//     const totalWrongQuestions = resultQuestion.length - totalRightQuestions

//     if (!result) {
//       return res.status(400).json({
//         status: 400,
//         message: 'no result found!'
//       })
//     }

//     res.json({
//       status: 200,
//       data: {
//         ...result.toObject(),
//         totalRightQuestions,
//         totalWrongQuestions
//       },
//       message: 'success!!'

//     })
//   } catch (e) {
//     res.status(400).json({
//       status: 400,
//       message: e.message
//     })
//   }
// })

router.get('/results', auth, async (req, res) => {
  try {
    const id = req.user._id
    const result = await Results.find({ userID: id })
    // console.log(result)
    const allQuestions = result.flatMap(question => question.questions)
    // console.log(allQuestions)

    const totalRightQuestions = allQuestions.filter((question) => {
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
      message: 'please complete quiz'
    })
  }
})

module.exports = router
