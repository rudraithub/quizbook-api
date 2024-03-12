// mongodb database connection

// const mongoose = require('mongoose')

// const URL = process.env.MONGODBURL

// mongoose.connect(URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to the database')
// }).catch((error) => {
//   console.error(`Error connecting to the database: ${error}`)
// })

const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.MYSQL_QZ_DB_NAME, process.env.MYSQL_QZ_USERNAME, process.env.MYSQL_QZ_PASSWORD, {
  host: process.env.MYSQL_DB_SERVER,
  dialect: 'mysql',
  logging: false
})

// try {
//   sequelize.authenticate();
//   console.log('Connection has been established successfully.');
//   sequelize.sync();
//   console.log('All models synchronized successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error.message);
// }

module.exports = sequelize
