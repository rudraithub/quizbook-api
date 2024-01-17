const express = require('express')
const app = express()
// const cors = require('cors')
require('./db/mongoose')

const userRouter = require('./routes/user')
const stdRouter = require('./routes/std')
const resultRouter = require('./routes/result')
const historyRouter = require('./routes/history')

const port = process.env.PORT || 3000

// app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(stdRouter)
app.use(resultRouter)
app.use(historyRouter)

app.listen(port, () => {
  console.log('sever connected on ', port)
})
