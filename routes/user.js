/* eslint-disable camelcase */

const express = require('express')
const User = require('../models/user')
const axios = require('axios')
const multer = require('multer')

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
  name: 'student'
}, {
  id: 2,
  name: 'teacher'
}, {
  id: 3,
  name: 'admin'
}
]

// router.use(cors())

router.post('/users/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, gender, DOB, professionId, mobileNumber, user_id } = req.body

    const prof = await axios.get('http://localhost:3000/users/profession')
    // console.log(prof.data)

    const availabledata = prof.data

    // console.log('Profession ID from request:', professionId);
    // console.log('Available Professions:', availabledata);
    // availabledata.forEach(proff => {
    //     console.log('ID:', proff.id, 'Type:', typeof proff.id);
    // });

    // const availabledata = prof.data;

    // Move this line before the console.log statements
    const profession = availabledata.find(proff => proff.id === professionId)
    // console.log('Profession ID from request:', professionId);
    // console.log('Selected Profession:', profession);
    // console.log('Available Professions:', availabledata);

    // const profession = availabledata.find(proff => proff.id === professionId);
    // console.log(profession)

    if (!profession) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid profession ID'
      })
    }

    // const isEmail = await User.findOne({ email })
    // if (isEmail) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'email is already registered!!!'
    //   })
    // }

    const isMob = await User.findOne({ mobileNumber })
    if (isMob) {
      return res.status(400).json({
        status: 400,
        message: 'mobile nubmer is already registered!!!'
      })
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      gender,
      DOB,
      mobileNumber,
      profession: {
        _id: profession.id,
        name: profession.name
      },
      user_id
    })

    await newUser.save()

    const response = {
      status: 201,
      data: newUser,
      message: 'register successfully!'
    }

    res.set({
      'Content-Type': 'application/json'
    })

    res.status(201).json(response)
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

    const user = await User.findOne({ mobileNumber })

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
    const user = await User.findOne({ mobileNumber })
    // console.log(user)
    const token = await authToken(user._id)
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
      req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
    }
    await req.user.save()
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
    const userID = req.user._id

    const user = await User.findOne({ _id: userID })

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

    const userID = req.user._id
    const user = await User.findByIdAndUpdate(userID, {
      firstName,
      lastName
    }, {
      new: true,
      runValidators: true
    })

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'You are not register yet, please signup first!'
      })
    }
    res.status(200).json({
      status: 200,
      data: user,
      message: 'profile update successfully!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'You are not register yet, please signup or login'
    })
  }
})

router.get('/users/profession', (req, res) => {
  res.set({
    'Content-Type': 'application/json'
  })
  res.json(professions)
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
  if (!req.file) {
    throw new Error('Please upload an image')
  }

  const userid = req.user._id

  console.log('User ID:', userid)

  const user = await User.findById(userid)
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'You are not register yet, please signup first!'
    })
  }
  user.userProfile = `http://localhost:3000/${req.file.originalname}`

  await user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

// delete user profile
router.delete('/users/avatars', async (req, res) => {
  try {
    const user_id = req.user._id
    const user = await User.findById({ user_id })

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'You are not register yet, please signup first!'
      })
    }

    user.userProfile = undefined
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
