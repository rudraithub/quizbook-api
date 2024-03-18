/* eslint-disable camelcase */

const express = require('express')
const User = require('../models/user')
const axios = require('axios')
const moment = require('moment')
const router = express.Router()
const cors = require('cors')
const authToken = require('../utils/generateAuth')
const auth = require('../middleware/auth')
const upload = require('../cloudinary_connection/multer_connection')

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

// upload user profile

router.get('/users/gender', async (req, res, next) => {
  try {
    const genderData = genders
    res.status(200).json({
      status: 200,
      data: genderData,
      message: 'Gender fetch success!!'
    })
  } catch (error) {
    next(error)
  }
})

router.post('/users/signup', upload.single('userProfile'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: 'please upload an image!'
      })
    }
    const { firstName, lastName, email, genderID, DOB, professionId, mobileNumber } = req.body

    if (firstName === '' || lastName === '') {
      throw new Error('please provide firstName and lastName')
    }

    if (!moment(DOB, 'DD/MM/YYYY', true).isValid()) {
      return res.status(400).json({
        status: 400,
        message: 'Please provide a date in DD/MM/YYYY format.'
      })
    }

    const prof = await axios.get(`http://${process.env.SERVER_DOMAIN_NAME}/users/profession`)

    if (!prof) throw new Error('unble to fetch profession data!')

    // console.log(prof.data)

    const availabledata = prof.data.data

    const profession = availabledata.find(proff => proff.id === parseInt(professionId))

    if (!profession) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid profession ID'
      })
    }

    const genders = await axios.get(`http://${process.env.SERVER_DOMAIN_NAME}/users/gender`)
    if (!genders) throw new Error('unble to fetch gender data!')
    // console.log(gender)

    const genderData = genders.data.data
    // console.log(genderData)

    const isGender = genderData.find(id => id.id === parseInt(genderID))
    if (!isGender) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid Gender ID'
      })
    }

    // console.log(isGender)

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

    // console.log(req.file)
    // console.log(req.file.filename)

    const image = req.file.path
    // console.log(image)

    const newUser = User.build({
      userProfile: image,
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

    // console.log(newUser.toJSON())
    await newUser.save()

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
    next(errorRes)
    // console.log(e.message)
  }
})

router.post('/user/varify', async (req, res, next) => {
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
    next(error)
  }
})

router.post('/users/login', async (req, res, next) => {
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
      status: 400,
      message: 'You are not register yet, please signup!'
    }

    next(errorRes)
  }
})

router.post('/user/logout', auth, async (req, res, next) => {
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
    next(error)
  }
})

// get user profile
router.get('/profile', auth, async (req, res, next) => {
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
    next(error)
  }
})

// user profile update

router.post('/profile/update', auth, upload.single('userProfile'), async (req, res, next) => {
  try {
    const { firstName, lastName, email, DOB, professionId, genderID } = req.body

    if (firstName === '' || lastName === '' || email === '' || DOB === '') {
      return res.status(400).json({
        status: 400,
        message: 'Field should not be empty!'
      })
    }

    const userID = req.user.id

    // const lastRecordedUser = await User.findOne({ where: { id: userID } })

    let profession
    if (professionId) {
      const prof = await axios.get(`http://${process.env.SERVER_DOMAIN_NAME}/users/profession`)
      if (!prof) throw new Error('unble to fetch profession data!')
      // // console.log(prof.data)

      const availabledata = prof.data.data

      const isProfession = availabledata.find(proff => proff.id === parseInt(professionId))

      if (!isProfession) {
        return res.status(400).json({
          status: 400,
          message: 'Invalid profession ID'
        })
      }

      profession = [{
        _id: isProfession.id,
        name: isProfession.name
      }]
    }

    let gender

    if (genderID) {
      const genders = await axios.get(`http://${process.env.SERVER_DOMAIN_NAME}/users/gender`)
      if (!genders) throw new Error('unble to fetch gender data!')
      // console.log(gender)

      const genderData = genders.data.data
      // console.log(genderData)

      const isGender = genderData.find(id => id.id === parseInt(genderID))

      if (!isGender) {
        return res.status(400).json({
          status: 400,
          message: 'Invalid Gender ID'
        })
      }

      gender = [{
        _id: isGender.id,
        name: isGender.gender
      }]
    }

    let userImage = req.user.userProfile
    if (req.file) {
      userImage = req.file.path
    }

    // console.log(`new record: ${userImage}`)
    // console.log(`last record: ${lastRecordedUser.userProfile}`)

    // // Check if firstName and lastName are the same as the last recorded values
    // if (lastRecordedUser.userProfile === userImage && lastRecordedUser.firstName === firstName && lastRecordedUser.lastName === lastName && lastRecordedUser.email === email && lastRecordedUser.DOB === DOB && lastRecordedUser.gender[0]._id === parseInt(genderID) && lastRecordedUser.profession[0]._id === parseInt(professionId)) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'updated value should not be same as per last records!'
    //   })
    // }

    const user = await User.update({ firstName, lastName, email, DOB, gender, profession, userProfile: userImage }, { where: { id: userID } })
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'You are not register yet, please signup or login first!'
      })
    }

    const updatedUser = await User.findOne({ where: { id: userID } })
    res.status(200).json({
      status: 200,
      data: updatedUser,
      message: 'profile update successfully!'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/users/profession', async (req, res, next) => {
  try {
    const professionData = professions
    res.status(200).json({
      status: 200,
      data: professionData,
      message: 'Proffession fetch success!!'
    })
  } catch (error) {
    next(error)
  }
})

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
    user.userProfile = req.file.path

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
  res.status(400).json({
    status: 400,
    message: error.message
  })
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

module.exports = { router }
/* eslint-enable camelcase */
