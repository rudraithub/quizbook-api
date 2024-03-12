require('dotenv').config()
const express = require('express')
const app = express()
// const cors = require('cors')
const sequelize = require('./db/dbConnect')

const { router } = require('./routes/user')
const stdRouter = require('./routes/std')
const resultRouter = require('./routes/result')
const historyRouter = require('./routes/history')

const port = process.env.PORT || 3000

// app.use(cors())

app.get('/health', async(req, res) => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    // console.log('Connection has been established successfully.')
    res.status(200).json({
      status: 200,
      message: 'Connection has been established successfully.'
    })
  } catch (error) {
    // console.error('Unable to connect to the database:', error.message)
    res.status(400).json({
      status: 400,
      message: `Unable to connect to the database: ${error}`
    })
  }
})

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
