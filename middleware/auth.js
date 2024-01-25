const jwt = require('jsonwebtoken')

const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    // console.log(token)
    const decode = jwt.verify(token, 'rudraIthubfotquizbook')
    // console.log(decode)
    const user = await User.findOne({ _id: decode.id, 'tokens.token': token })
    // console.log(user)
    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: 'unauthorized!'
    })
  }
}

module.exports = auth
