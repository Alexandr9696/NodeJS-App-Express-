const multer = require('multer')


// первый параметр в колбэке (cb) - ошибка (null)
// куда и как сохранять файлы на сервере
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

// валидация для файлов
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({
  storage, fileFilter
})