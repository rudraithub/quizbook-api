const jwt = require('jsonwebtoken')

const User = require('../models/user')

const auth = async (req, res, next) => {
try {
    const token = req.header('Authorization').replace('Bearer ', '')
    // console.log(token)
    const decode = jwt.verify(token, 'rudraIthubfotquizbook')
    // console.log(decode)
    const user = await User.findOne({_id: decode.id, 'tokens.token': token})
    // console.log(user)
    req.user = user
    next()
} catch (error) {
    res.send('somethings went wronge!')
}
}

module.exports = auth