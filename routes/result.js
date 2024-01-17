const express = require('express')
const Results = require('../models/result')
const standard = require('./standard')
const question = require('./question')
const chapterData = require('./chapter')

<<<<<<< HEAD

const cors = require('cors');
=======
const cors = require('cors')
const User = require('../models/user')
>>>>>>> f781b853d514db9934b773e72e3080810df39311



const router = express.Router()

router.use(cors())

router.post('/:userID/results', async (req, res) => {
  try {
    const { stdid, subid, chapterid, questions } = req.body
    const userID = req.params.userID

<<<<<<< HEAD


router.post('/results', async (req, res) => {
    try {
        const { stdid, subid, chapterid, questions } = req.body;

        const stdId = standard.find((p) => p.stdid === stdid);
        if (!stdId) {
            return res.status(400).json({
                status: 'fails',
                message: "No standard found"
            });
        }

        const subId = stdId.subject.find((p) => p.subid === subid);

        if (!subId) {
            return res.status(400).json({
                status: 'fails',
                message: "No subject found"
            });
        }

        const chapterIdArray = chapterData[stdid] && chapterData[stdid][subid];
        const chapterId = chapterIdArray && chapterIdArray.find((p) => p.chapterid === chapterid);

        if (!chapterId) {
            return res.status(400).json({
                status: 'fails',
                message: "No chapter found"
            });
        }

        const resultQuestion = questions.map(({ queid, user_answer }) => {
            const queArr = question[chapterid];
            const queData = queArr && queArr.find((p) => p.queid === queid);

            if (!queData) {
                return res.status(400).json({
                    status: 'fails',
                    message: "No question found"
                });
            }

            const isCorrect = user_answer.toLowerCase() === queData.rightAns.toLowerCase()
            console.log(isCorrect)

            return {
                queid: queData.queid,
                user_answer,
                user_result: isCorrect
            };
        });

        const result = new Results({
            stdid: stdId.stdid,
            subid: subId.subid,
            chapterid: chapterId.chapterid,
            questions: resultQuestion,
        });

        await result.save();
        const totalRightQuestions = resultQuestion.filter(question => question.user_result === true).length;
        const totalWrongQuestions = resultQuestion.length - totalRightQuestions;

        if (!result) {
            return res.status(400).json({
                status: 400,
                message: 'no result found!'
            });
        }


        res.json({
            status: 200,
            data: {
                ...result.toObject(),
                totalRightQuestions,
                totalWrongQuestions
            },
            message: 'success!!'
        });

    } catch (e) {
        res.status(400).json({
            status: 400,
            message: e.message
        });
    }


});



router.get('/results', async (req, res) => {

    try {
        const result = await Results.find()
        // console.log(result)
        const allQuestions = result.flatMap(question => question.questions)
        // console.log(allQuestions)


        const totalRightQuestions = allQuestions.filter((question) => {

            return question.user_result === true
        }).length

        const totalWrongQuestions = allQuestions.length - totalRightQuestions

        // console.log(totalRightQuestions)
        // console.log(totalWrongQuestions)

        res.json({
            status: 200,
            data: {
                totalRightQuestions,
                totalWrongQuestions
            },
            message: 'success!!'
        })
=======
    const user = await User.findById(userID)

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'User not found'
      })
    }

    const stdId = standard.find((p) => p.stdid === stdid)
    if (!stdId) {
      return res.status(400).json({
        status: 'fails',
        message: 'No standard found'
      })
>>>>>>> f781b853d514db9934b773e72e3080810df39311
    }

    const subId = stdId.subject.find((p) => p.subid === subid)

    if (!subId) {
      return res.status(400).json({
        status: 'fails',
        message: 'No subject found'
      })
    }

    const chapterIdArray = chapterData[stdid] && chapterData[stdid][subid]
    const chapterId = chapterIdArray && chapterIdArray.find((p) => p.chapterid === chapterid)

    if (!chapterId) {
      return res.status(400).json({
        status: 'fails',
        message: 'No chapter found'
      })
    }

    /* eslint-disable camelcase */
    const resultQuestion = questions.map(({ queid, user_answer }) => {
      const queArr = question.filter((q) => q.chapterid === chapterid);
      const queData = queArr && queArr.find((p) => p.queid === queid)

      if (!queData) {
        return res.status(400).json({
          status: 'fails',
          message: 'No question found'
        })
      }

      const isCorrect = user_answer.toLowerCase() === queData.rightAns.toLowerCase()
      console.log(isCorrect)

      return {
        queid: queData.queid,
        user_answer,
        user_result: isCorrect
      }
    })

    /* eslint-enable camelcase */

    const result = new Results({
      userID,
      stdid: stdId.stdid,
      subid: subId.subid,
      chapterid: chapterId.chapterid,
      questions: resultQuestion
    })

    await result.save()
    const totalRightQuestions = resultQuestion.filter(question => question.user_result === true).length
    const totalWrongQuestions = resultQuestion.length - totalRightQuestions

    if (!result) {
      return res.status(400).json({
        status: 400,
        message: 'no result found!'
      })
    }

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
