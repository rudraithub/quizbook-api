const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authToken = async (id) => {
  try {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      throw new Error('You are not register yet, please signup!')
    }
    const token = jwt.sign({ id }, 'rudraIthubfotquizbook')
    // user.tokens = user.tokens.concat({ token })
    user.tokens = token

    await user.save()
    // console.log(user.tokens)

    return token
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = authToken
