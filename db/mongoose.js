const mongoose = require('mongoose')

const URL = process.env.MONGODBURL

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database')
}).catch((error) => {
  console.error('Error connecting to the database:', error)
})
