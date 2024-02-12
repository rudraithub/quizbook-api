const express = require('express')
const cors = require('cors')
const router = express.Router()
// const chapterData = require('./chapter')
const question = require('./question')
// const standard = require('./standard')
const { Std, Subject } = require('../models/std')
const Chapters = require('../models/chapter')
const Question = require('../models/question')
const { roleCheck } = require('../middleware/roleCheck')
const auth = require('../middleware/auth')
router.use(cors())

// sql router for std and subjects

router.post('/addstd', auth, roleCheck('Admin'), async (req, res) => {
  try {
    const { std } = req.body

    const isStd = await Std.findOne({ where: { std } })

    if (isStd) {
      return res.status(400).json({
        status: 400,
        message: 'standard already exist!'
      })
    }
    const newStd = Std.build({
      std
    })

    console.log(newStd.toJSON())

    // await newStd.save()

    res.status(200).json({
      status: 200,
      data: newStd,
      message: 'Standard added successfully!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

router.post('/addsubjects',auth, roleCheck('Admin'), async (req, res) => {
  try {
    const { stdid, subjectName, img } = req.body

    const isStd = await Std.findOne({ where: { stdid } })

    if (!isStd) {
      return res.status(400).json({
        status: 400,
        message: 'standard not found!'
      })
    }

    const newSubject = Subject.build({
      stdid,
      subjectName,
      img
    })

    await newSubject.save()

    res.status(200).json({
      status: 200,
      data: newSubject,
      message: 'subject added successfully!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

router.get('/std', async (req, res) => {
  try {
    const std = await Std.findAll({
      include: {
        model: Subject,
        as: 'Subjects',
        attributes: { exclude: ['stdid'] }
      }
    })

    res.status(200).json({
      status: 200,
      data: std,
      message: 'Data fetched successfully!'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error!'
    })
  }
})

router.post('/std/subject/addchapters', auth, roleCheck('Admin'), async (req, res) => {
  try {
    const { stdid, subid, chapterid, content, chapterno, teacher, que, minute } = req.body
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

    const newChapter = Chapters.build({
      stdid,
      subid,
      content,
      chapterid,
      chapterno,
      teacher,
      que,
      minute
    })

    await newChapter.save()

    console.log(newChapter)
    res.status(200).json({
      status: 200,
      data: newChapter,
      message: 'Chapter Added successfully!'
    })
  } catch (error) {
    console.log(error.message)
  }
})

router.post('/std/subject/chapter', async (req, res) => {
  try {
    const stdId = req.body.stdid
    const subId = req.body.subid

    const std = await Std.findOne({ where: { stdid: stdId } })

    if (!std) {
      return res.status(400).json({
        status: 400,
        message: 'standard not found!'
      })
    }

    const sub = await Subject.findOne({ where: { subid: subId } })

    if (!sub) {
      return res.status(400).json({
        status: 400,
        message: 'subject not found!'
      })
    }

    const chapterDetails = await Chapters.findAll({ where: { stdid: std.stdid, subid: sub.subid }, attributes: { exclude: ['stdid', 'subid'] } })
    if (chapterDetails.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'chapter is not found!'
      })
    }

    res.json({
      status: 200,
      data: chapterDetails,
      message: 'success!!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

router.get('/questions', async (req, res) => {
  const arayQuestion = Object.values(question)
  console.log(arayQuestion)
  res.set({
    'Content-Type': 'application/json'
  })
  res.json({
    status: 200,
    data: arayQuestion
  })
})

router.post('/std/subject/chapter/addquestions', auth, roleCheck('Admin'), async (req, res) => {
  try {
    /* eslint-disable camelcase */
    const { stdid, subid, chapterid, question_no, question, Option, rightAns } = req.body
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

    const questionData = Question.build({
      stdid,
      subid,
      chapterid,
      question_no,
      question,
      Option,
      rightAns
    })

    await questionData.save()

    res.status(200).json({
      status: 200,
      data: questionData,
      message: 'question successfully added!'
    })
    /* eslint-enable camelcase */
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

router.post('/std/subject/chapter/questions', async (req, res) => {
  try {
    const stdID = req.body.stdid
    const subId = req.body.subid
    const chapterId = req.body.chapterid

    const std = await Std.findOne({ where: { stdid: stdID } })

    if (!std) {
      return res.status(400).json({
        status: 400,
        message: 'standard not found!'
      })
    }

    const sub = await Subject.findOne({ where: { subid: subId } })

    if (!sub) {
      return res.status(400).json({
        status: 400,
        message: 'subject not found!'
      })
    }

    const chapter = await Chapters.findOne({ where: { chapterid: chapterId } })
    if (!chapter) {
      return res.status(400).json({
        status: 400,
        message: 'chapter not found!'
      })
    }

    const question = await Question.findAll({ where: { stdid: stdID, subid: subId, chapterid: chapterId } })

    if (!question) {
      return res.status(400).json({
        status: 400,
        message: 'no qestion found!'
      })
    }

    res.status(200).json({
      status: 200,
      data: question,
      message: 'Success!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

module.exports = router
