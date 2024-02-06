const { DataTypes } = require('sequelize')

const sequelize = require('../db/dbConnect')
const { Subject, Std } = require('./std')
const Chapters = require('./chapter')

const Question = sequelize.define('questions', {
  queid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
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
  question_no: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Option: {
    type: DataTypes.TEXT, // Store options as a string
    allowNull: false,
    get () {
      const rawValue = this.getDataValue('Option')
      return rawValue ? rawValue.split(',') : []
    },
    set (value) {
      this.setDataValue('Option', value.join(','))
    }
  },
  rightAns: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { timestamps: false })

Chapters.hasMany(Question, { foreignKey: 'chapterid' })
Question.belongsTo(Std, { foreignKey: 'stdid' })
Question.belongsTo(Subject, { foreignKey: 'subid' })
Question.belongsTo(Chapters, { foreignKey: 'chapterid' })

module.exports = Question
