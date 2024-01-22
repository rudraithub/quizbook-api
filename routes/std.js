const express = require('express')
const cors = require('cors')
const Subject = require('../models/std')
require('../chapter.json')

const router = express.Router()
const chapterData = require('./chapter')
const question = require('./question')
const standard = require('./standard')
// const cors = require('cors')

router.use(cors())

// router.post('/std', async (req, res) => {
//   try {
//     const subdata = req.body

//     const isStandard = await Subject.findOne({ stdid: subdata.stdid })
//     if (isStandard) {
//       isStandard.subject.push(...subdata.subject)
//       console.log(isStandard)
//       await isStandard.save()

//       res.status(200).json({
//         status: 201,
//         data: isStandard,
//         message: 'Subject added to standatrd'
//       })
//     } else {
//       const newStd = req.body

//       const subData = new Subject({...newStd})
//       await subData.save()

//       res.status(201).json({
//         status: 201,
//         data: newStd,
//         message: 'New standard and subjects added!'
//       })
//     }
//   } catch (error) {
//     res.status(404).json({
//       status: 404,
//       message: error.message
//     })
//   }
// })

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
  const Chapter = Object.values(chapterData).flatMap(data => Object.values(data))
  // console.log(Chapter)
  const chap = Chapter.flat()
  // console.log(chap)'

  res.json({
    status: 200,
    data: chap,
    message: 'success!'
  })
})

router.post('/std/subject/chapter', async (req, res) => {
  const stdId = req.body.stdid
  const subId = req.body.subid

  const std = standard.find((p) => p.stdid === parseInt(stdId))

  if (!std) {
    return res.status(400).json({
      status: 400,
      message: 'standard not found'
    })
  }

  const sub = std.subject.find((p) => p.subid === parseInt(subId))

  if (!sub) {
    return res.status(400).json({
      status: 400,
      message: 'standard not found'
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

  try {
    const stdId = req.body.stdid
    const subId = req.body.subid

    const std = standard.find((p) => p.stdid === parseInt(stdId))

    if (!std) {
      return res.status(400).json({
        status: 400,
        message: 'standard not found!'
      })
    }

    const sub = std.subject.find((p) => p.subid === parseInt(subId))

    if (!sub) {
      return res.status(400).json({
        status: 400,
        message: 'subject not found!'
      })
    }

    const chapters = chapterData[stdId] && chapterData[stdId][subId]

    // console.log(chapters)

    if (!chapters || chapters.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'chapter is not found!'
      })
    }

    res.json({
      status: 200,
      data: chapters,
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

// router.get('/chapter/:chapterid/questions', async (req, res) => {
//   const chapterId = req.params.chapterid

//   // const chapter = chapterData.find((p) => p.id === chapterId)
//   const chapter = chapterData[chapterId]

//   if (!chapter) {
//     return res.status(400).json({
//       status: 400,
//       message: 'chapter not found'
//     })
//   }

//   const qData = question[chapterId]

//   if (!qData) {
//     return res.status(404).json({
//       status: 404,
//       message: 'Chapter not found'
//     })
//   }

//   // console.log(qData)
//   res.set({
//     'Content-Type': 'application/json'
//   })
//   res.json({
//     status: 200,
//     data: qData,
//     message: 'success!!'
//   })
// })

router.post('/std/subject/chapter/questions', (req, res) => {
  const stdID = req.body.stdid;
  const subId = req.body.subid;
  const chapterId = req.body.chapterid;

  const isStd = standard.find(s => s.stdid === parseInt(stdID))

  if (!isStd) {
    return res.status(404).json({
      status: 404,
      message: 'standard not found!'
    })
  }

  const isSub = isStd.subject.find(s => s.subid === parseInt(subId))

  if (!isSub) {
    return res.status(404).json({
      status: 404,
      message: 'subject not found!'
    })
  }

  const chapters = chapterData[stdID] && chapterData[stdID][subId]

  const ischapter = chapters.find(s => s.chapterid === parseInt(chapterId))

  if (!ischapter) {
    return res.status(404).json({
      status: 404,
      message: 'chapter not found!'
    })
  }

  const chapterQuestions = question.filter((questions) => questions.stdid === isStd.stdid && questions.subid === isSub.subid && questions.chapterid === ischapter.chapterid)
  if (chapterQuestions.length === 0) {
    return res.status(404).json({
      status: 404,
      message: 'No questions found!'
    })
  }

  res.status(200).json({
    status: 200,
    data: chapterQuestions,
    message: 'Success!'
  })
})

module.exports = router
