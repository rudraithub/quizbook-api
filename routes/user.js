/* eslint-disable camelcase */

const express = require('express')
const User = require('../models/user')
const axios = require('axios')
const multer = require('multer')
const moment = require('moment')
const router = express.Router()
const cors = require('cors')
const authToken = require('../utils/generateAuth')
const auth = require('../middleware/auth')

// router.use(cors())

// const id = {
//     '1': 'student',
//     '2': 'teacher',
//     '3': 'admin'
// }

router.use(cors())
const professions = [{
  id: 1,
  name: 'Student'
}, {
  id: 2,
  name: 'Teacher'
}, {
  id: 3,
  name: 'Admin'
}
]

const genders = [{
  id: 1,
  gender: 'Male'
}, {
  id: 2,
  gender: 'Female'
}, {
  id: 3,
  gender: 'Others'
}]

router.get('/users/gender', async (req, res) => {
  try {
    const genderData = genders
    res.status(200).json({
      status: 200,
      data: genderData,
      message: 'Gender fetch success!!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      error: error.message
    })
  }
})

router.post('/users/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, genderID, DOB, professionId, mobileNumber } = req.body

    if (!moment(DOB, 'DD/MM/YYYY', true).isValid()) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid date format for DOB. Please provide a date in DD/MM/YYYY format.'
      })
    }

    const prof = await axios.get('http://localhost:3000/users/profession')
    // console.log(prof.data)

    const availabledata = prof.data

    const profession = availabledata.find(proff => proff.id === professionId)

    if (!profession) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid profession ID'
      })
    }

    const genders = await axios.get('http://localhost:3000/users/gender')
    // console.log(gender)

    const genderData = genders.data.data
    console.log(genderData)

    const isGender = genderData.find(id => id.id === genderID)
    if (!isGender) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid Gender ID'
      })
    }
    console.log(isGender)

    // const isEmail = await User.findOne({ email })
    // if (isEmail) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'email is already registered!!!'
    //   })
    // }

    const isMob = await User.findOne({ where: { mobileNumber } })
    if (isMob) {
      return res.status(400).json({
        status: 400,
        message: 'mobile nubmer is already registered!!!'
      })
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      gender: [{
        _id: isGender.id,
        name: isGender.gender
      }],
      DOB,
      mobileNumber,
      profession: [{
        _id: profession.id,
        name: profession.name
      }]
    })

    const response = {
      status: 200,
      data: newUser,
      message: 'register successfully!'
    }

    res.status(200).json(response)
    // console.log(newUser)
    // console.log(res.status(201).send(newUser))
  } catch (e) {
    const errorRes = {
      status: 400,
      message: e.message
    }
    res.status(400).json(errorRes)
    // console.log(e.message)
  }
})

router.post('/user/varify', async (req, res) => {
  try {
    const { mobileNumber } = req.body

    const user = await User.findOne({ where: { mobileNumber } })

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'You are not register yet, please signup!'
      })
    }

    res.status(200).json({
      status: 200,
      message: 'success!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const { mobileNumber } = req.body
    const user = await User.findOne({
      where: { mobileNumber },
      attributes: { exclude: ['tokens'] }
    })
    // console.log(user)
    const token = await authToken(user.id)
    // console.log(token)

    if (!user) {
      throw new Error('You are not register yet, please signup!')
    }

    // if(!OTP || OTP === null || OTP.toString().length !== 4){
    //     throw new Error('please provide 4 digit otp')
    // }

    const response = {
      status: 200,
      data: user,
      token,
      message: 'login sucessfully!'
    }

    res.json(response)
  } catch (error) {
    const errorRes = {
      status: 404,
      message: 'You are not register yet, please signup!'
    }

    res.status(404).json(errorRes)
  }
})

router.post('/user/logout', auth, async (req, res) => {
  try {
    if (req.user) {
      req.user.tokens = null
      await req.user.save()
    }
    res.status(200).json({
      status: 200,
      message: 'logout success'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'you are already logout!'
    })
  }
})

// get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userID = req.user.id

    const user = await User.findOne({ where: { id: userID } })

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'You are not register yet, please signup first!'
      })
    }

    res.status(200).json({
      status: 200,
      data: user,
      message: 'success!!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'You are not register yet, please signup or login'
    })
  }
})

// user profile update

router.post('/profile/update', auth, async (req, res) => {
  try {
    const { firstName, lastName } = req.body

    const userID = req.user.id
    const user = await User.update({ firstName, lastName }, { where: { id: userID } })
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'You are not register yet, please signup first!'
      })
    }

    const updatedUser = await User.findOne({ where: { id: userID } })
    res.status(200).json({
      status: 200,
      data: updatedUser,
      message: 'profile update successfully!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'You are not register yet, please signup or login'
    })
  }
})

router.get('/users/profession', async (req, res) => {
  try {
    const professionData = professions
    res.status(200).json({
      status: 200,
      data: professionData,
      message: 'Proffession fetch success!!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      error: error.message
    })
  }
})

// upload user profile

const storage = multer.diskStorage({
  destination: 'avatar',
  filename (req, file, cb) {
    // cb(null, file.fieldname + Date.now() + '_' + path.extname(file.originalname))
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)/)) {
      return cb(new Error('please upload an image'))
    }
    cb(undefined, true)
  }
})

router.use('/', express.static('avatar'))

router.post('/users/avatars', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Please upload an image')
    }

    const userid = req.user.id

    console.log('User ID:', userid)

    const user = await User.findOne({ where: { id: userid } })
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'You are not register yet, please signup first!'
      })
    }
    user.userProfile = `http://localhost:3000/${req.file.originalname}`

    await user.save()
    res.status(200).json({
      status: 200,
      message: 'profile upload success!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
}, (error, req, res, next) => {
  res.status(400).json({ error: error.message })
})

// delete user profile
router.delete('/users/avatars', auth, async (req, res) => {
  try {
    const user_id = req.user.id
    const user = await User.findOne({ where: { id: user_id } })

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'You are not register yet, please signup first!'
      })
    }

    user.userProfile = null
    await user.save()
    res.status(200).json({
      status: 200,
      message: 'Profile deleted successfully',
      data: user
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({ status: 400, message: error.message })
  }
})

module.exports = router
/* eslint-enable camelcase */
