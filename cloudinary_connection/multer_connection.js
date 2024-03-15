const multer = require('multer')
const cloudinary = require('./cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// const storage = multer.memoryStorage({})
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Dashboard/quizbook',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    uniqueFilename: true
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1048576
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)/)) {
      return cb(new Error('please upload an image in jpg/png/jpeg formate!'))
    }
    cb(undefined, true)
  }
})

module.exports = upload
