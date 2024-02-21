require('dotenv').config()
const express = require('express')
const app = express()
// const cors = require('cors')
require('./db/dbConnect')

const {router} = require('./routes/user')
const stdRouter = require('./routes/std')
const resultRouter = require('./routes/result')
const historyRouter = require('./routes/history')

const port = process.env.PORT || 3000

// app.use(cors())

app.use(express.json())
app.use(router)
app.use(stdRouter)
app.use(resultRouter)
app.use(historyRouter)

app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Not Found!!!'
  })
})

app.listen(port, () => {
  console.log('sever connected on ', port)
})
