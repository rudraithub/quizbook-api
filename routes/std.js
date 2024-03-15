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
const { upload } = require('./user')
router.use(cors())

// sql router for std and subjects

router.post('/addstd', auth, roleCheck('Admin'), async (req, res) => {
  try {
    const { std } = req.body

    const standard = parseInt(std)

    if (isNaN(standard) || standard === 0 || standard < 1 || standard > 12) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid standard value. Please provide a number between 1 and 12.'
      })
    }

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

    // console.log(newStd.toJSON())

    await newStd.save()

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

router.post('/addsubjects', auth, roleCheck('Admin'), upload.single('img'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('please upload an image!')
    }

    const { stdid, subjectName } = req.body

    const isStd = await Std.findOne({ where: { stdid } })

    if (!isStd) {
      return res.status(400).json({
        status: 400,
        message: 'standard not found!'
      })
    }

    if (subjectName === '' || null || undefined) {
      throw new Error('subjct name should not be empty!')
    }

    const existingSubject = await Subject.findOne({
      where: { stdid, subjectName }
    })

    if (existingSubject) {
      return res.status(400).json({
        status: 400,
        message: 'Subject already exists for this standard!'
      })
    }

    const subjectImage = req.file.path

    const newSubject = Subject.build({
      stdid,
      subjectName,
      img: subjectImage
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
}, (err, req, res, next) => {
  return res.status(400).json({
    status: 400,
    message: err.message
  })
})

router.get('/std', async (req, res) => {
  try {
    const std = await Std.findAll({
      include: {
        model: Subject,
        as: 'Subjects',
        attributes: { exclude: ['stdid'] }
      },
      order: [
        ['std', 'ASC'],
        [{ model: Subject, as: 'Subjects' }, 'subjectName', 'ASC']
      ]
    })

    // Check if std is an empty array
    if (std.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'No data found!'
      })
    }

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
    const { stdid, subid, chapterid, content, teacher, que, minute } = req.body

    // check any field is empty or not
    if (content === '' || teacher === '' || minute === '') {
      return res.status(400).json({
        status: 400,
        message: 'Empty Field does not allowed, Please Fill all filed!'
      })
    }

    // if (!Number.isInteger(chapterno) || chapterno <= 0) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'Invalid chapter number.'
    //   })
    // }

    if (!Number.isInteger(que) || que <= 0) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid Question number.'
      })
    }

    const std = await Std.findOne({ where: { stdid } })
    if (!std) {
      return res.status(400).json({
        status: 400,
        message: 'standard not found!'
      })
    }

    const sub = await Subject.findOne({ where: { stdid, subid } })

    if (!sub) {
      return res.status(400).json({
        status: 400,
        message: 'subject not found!'
      })
    }

    // Check if there is a chapter with the same chapter number for the same standard and subject
    // const chapterExistWithChapterNo = await Chapters.findOne({
    //   where: { stdid, subid, chapterno }
    // })

    // if (chapterExistWithChapterNo) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'A chapter with the same chapter number already exists for this subject and standard'
    //   })
    // }

    // Check if there is a chapter with the same content for the same standard and subject
    const chapterExist = await Chapters.findOne({
      where: { stdid, subid, content }
    })

    if (chapterExist) {
      return res.status(400).json({
        status: 400,
        message: 'A chapter with the same content already exists for this subject and standard'
      })
    }

    const findMaxChapNo = await Chapters.max('chapterno', { where: { subid } })
    const chapterno = findMaxChapNo ? findMaxChapNo + 1 : 1

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

    // console.log(newChapter)
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

    const sub = await Subject.findOne({ where: { stdid: stdId, subid: subId } })

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
    const { stdid, subid, chapterid, question, Option, rightAns } = req.body

    if (question === '') {
      return res.status(400).json({
        status: 400,
        message: 'question not be empty!'
      })
    }

    if (rightAns < 0 || rightAns === null) {
      return res.status(400).json({
        status: 400,
        message: 'Right Answer cannot be empty!'
      })
    }

    if (Option.length !== 4) {
      return res.status(400).json({
        status: 400,
        message: 'You must provide 4 options!'
      })
    }
    const std = await Std.findOne({ where: { stdid } })

    if (!std) {
      return res.status(400).json({
        status: 400,
        message: 'standard not found!'
      })
    }

    const sub = await Subject.findOne({ where: { stdid, subid } })

    if (!sub) {
      return res.status(400).json({
        status: 400,
        message: 'subject not found!'
      })
    }

    const chapter = await Chapters.findOne({ where: { stdid, subid, chapterid } })
    if (!chapter) {
      return res.status(400).json({
        status: 400,
        message: 'chapter not found!'
      })
    }

    // check question with same question number exist
    // const isQuestionNo = await Question.findOne({ where: { stdid, subid, chapterid, question_no } })

    // if (isQuestionNo) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'A question with question number already exists for this chapter and standard!'
    //   })
    // }

    const isQuestion = await Question.findOne({ where: { stdid, subid, chapterid, question } })

    if (isQuestion) {
      return res.status(400).json({
        status: 400,
        message: 'A question with same content already exist!'
      })
    }

    const maxQuestionNo = await Question.max('question_no', { where: { chapterid } })
    const question_no = maxQuestionNo ? maxQuestionNo + 1 : 1

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

    const sub = await Subject.findOne({ where: { stdid: stdID, subid: subId } })

    if (!sub) {
      return res.status(400).json({
        status: 400,
        message: 'subject not found!'
      })
    }

    const chapter = await Chapters.findOne({ where: { stdid: stdID, subid: subId, chapterid: chapterId } })
    if (!chapter) {
      return res.status(400).json({
        status: 400,
        message: 'chapter not found!'
      })
    }

    const question = await Question.findAll({ where: { stdid: std.stdid, subid: sub.subid, chapterid: chapter.chapterid } })

    if (question.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'no qestion found!'
      })
    }

    const questionLength = question.length
    // console.log(questionLength)
    if (questionLength < 5) {
      return res.status(403).json({
        status: 403,
        message: `you have total ${questionLength} question, atleast 5 question required!`
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
