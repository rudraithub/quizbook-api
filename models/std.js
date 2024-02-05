// const mongoose = require('mongoose')

// const standardSchema = mongoose.Schema({
//   std: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   subject: [{
//     subjectName: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     img: {
//       type: String,
//       default: 'error'
//     },
//     subid: {
//       type: Number,
//       required: true
//     }
//   }],
//   stdid: {
//     type: Number,
//     required: true
//   }
// })

// const Subject = mongoose.model('subData', standardSchema)

// module.exports = Subject

// std and subject model

const { DataTypes } = require('sequelize')

const sequelize = require('../db/dbConnect')

const Std = sequelize.define('standard', {
  stdid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  std: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const Subject = sequelize.define('subject', {
  subid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default-image.png'
  }
})

Std.hasMany(Subject, { foreignKey: 'stdid', as: 'Subjects' })
Subject.belongsTo(Std, { foreignKey: 'stdid' })

module.exports = { Std, Subject }
