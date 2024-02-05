const express = require('express')
const cors = require('cors')
const router = express.Router()
const chapterData = require('./chapter')
const question = require('./question')
const standard = require('./standard')
const { Std, Subject } = require('../models/std')
const sequelize = require('../db/mongoose')

router.use(cors())

//sql router for std and subjects

router.get('/std', async (req, res) => {
  try {

    // Delete records from the subjects table
    await Subject.destroy({ truncate: true });

    // Rebuild and save standards with associated subjects
    const stdInstances = await Std.bulkCreate(standard.map((stdData) => {
      return {
        std: stdData.std,
        stdid: stdData.stdid,
        Subjects: stdData.subject
      }
    }), {
      include : {
        model: Subject,
        as: 'Subjects'
      },
      returning: true
    });
    
    res.status(200).json({
      status: 200,
      data: stdInstances,
      message: 'Success!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error!'
    });
  }
});

// router.get('/std', async(req, res) => {
//     try {
//         const subData = await Subject.create(standard)
//         res.json(subData)
//     } catch (error) {
//         res.status(400).json(error.message)
//     }
// })



// router.post('/std/subject/chapter', async (req, res) => {
//   try {
//     const stdId = req.body.stdid
//     const subId = req.body.subid

//     const std = standard.find((p) => p.stdid === parseInt(stdId))

//     if (!std) {
//       return res.status(400).json({
//         status: 400,
//         message: 'standard not found!'
//       })
//     }

//     const sub = std.subject.find((p) => p.subid === parseInt(subId))

//     if (!sub) {
//       return res.status(400).json({
//         status: 400,
//         message: 'subject not found!'
//       })
//     }

//     const chapters = chapterData[stdId] && chapterData[stdId][subId]

//     // console.log(chapters)

//     if (!chapters || chapters.length === 0) {
//       return res.status(400).json({
//         status: 400,
//         message: 'chapter is not found!'
//       })
//     }

//     res.json({
//       status: 200,
//       data: chapters,
//       message: 'success!!'
//     })
//   } catch (error) {
//     res.status(400).json({
//       status: 400,
//       message: error.message
//     })
//   }
// })

// router.get('/questions', async (req, res) => {
//   const arayQuestion = Object.values(question)
//   console.log(arayQuestion)
//   res.set({
//     'Content-Type': 'application/json'
//   })
//   res.json({
//     status: 200,
//     data: arayQuestion
//   })
// })



// router.post('/std/subject/chapter/questions', (req, res) => {
//   try {
//     const stdID = req.body.stdid
//     const subId = req.body.subid
//     const chapterId = req.body.chapterid

//     const isStd = standard.find(s => s.stdid === parseInt(stdID))

//     if (!isStd) {
//       return res.status(404).json({
//         status: 404,
//         message: 'standard not found!'
//       })
//     }

//     const isSub = isStd.subject.find(s => s.subid === parseInt(subId))

//     if (!isSub) {
//       return res.status(404).json({
//         status: 404,
//         message: 'subject not found!'
//       })
//     }

//     const chapters = chapterData[stdID] && chapterData[stdID][subId]

//     const ischapter = chapters.find(s => s.chapterid === parseInt(chapterId))

//     if (!ischapter) {
//       return res.status(404).json({
//         status: 404,
//         message: 'chapter not found!'
//       })
//     }

//     const chapterQuestions = question.filter((questions) => questions.stdid === isStd.stdid && questions.subid === isSub.subid && questions.chapterid === ischapter.chapterid)
//     if (chapterQuestions.length === 0) {
//       return res.status(404).json({
//         status: 404,
//         message: 'No questions found!'
//       })
//     }

//     res.status(200).json({
//       status: 200,
//       data: chapterQuestions,
//       message: 'Success!'
//     })
//   } catch (error) {
//     res.status(400).json({
//       status: 400,
//       message: error.message
//     })
//   }
// })

module.exports = router
