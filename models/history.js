const { DataTypes } = require('sequelize')
const sequelize = require('../db/dbConnect')

const History = sequelize.define('History', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  stdid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  std: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chapterID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chapterName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teacher: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false
  },
  submitTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalRightQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalWrongQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})

module.exports = History
