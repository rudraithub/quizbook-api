const { DataTypes } = require('sequelize')

const sequelize = require('../db/dbConnect')
const { Subject, Std } = require('./std')

const Chapters = sequelize.define('chapters', {
  stdid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chapterno: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chapterid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  teacher: {
    type: DataTypes.STRING,
    allowNull: false
  },
  que: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  minute: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: false })

Subject.hasMany(Chapters, { foreignKey: 'subid' })
Chapters.belongsTo(Std, { foreignKey: 'stdid' })
Chapters.belongsTo(Subject, { foreignKey: 'subid' })

module.exports = Chapters
