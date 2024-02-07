const { DataTypes } = require('sequelize')
const sequelize = require('../db/dbConnect')

const Results = sequelize.define('results', {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  resultid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  // userID: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },
  stdid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chapterid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  questions: {
    type: DataTypes.JSON, // Store questions as JSON
    allowNull: false
  },
  submitTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, { timestamps: false })

module.exports = Results
