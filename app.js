require('dotenv').config()
const newrelic = require('newrelic')
const express = require('express')
const app = express()
// const cors = require('cors')
const sequelize = require('./db/dbConnect')

const { router } = require('./routes/user')
const stdRouter = require('./routes/std')
const resultRouter = require('./routes/result')
const historyRouter = require('./routes/history')


newrelic.config = {
  appName: process.env.NEW_RELIC_APP_NAME,
  licenceKey: process.env.NEW_RELIC_LICENSE_KEY
}

// newrelic.getTraceMetadata()
newrelic.getLinkingMetadata()

const port = process.env.PORT || 3000

// app.use(cors())

app.get('/welcome', async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: 'welcome!'
    })
  } catch (error) {
    newrelic.noticeError(error)
    console.log(error.message)
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
})

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    // console.log('Connection has been established successfully.')
    res.status(200).json({
      status: 200,
      message: 'Connection has been established successfully.'
    })
  } catch (error) {
    console.log(error.message)
    newrelic.noticeError(error)
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

app.use((error, req, res, next) => {
  newrelic.noticeError(error)
  error.statusCode = error.statusCode || 400;
  error.status = error.status || "Error";
  res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
  });
});

app.listen(port, () => {
  console.log('sever connected on ', port)
})
