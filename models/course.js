const {Schema, model} = require('mongoose')

// создание модели
const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

courseSchema.method('toClient', function () {
  const course = this.toObject()

  course.id = course._id
  delete course._id

  return course
})

// регистрация модели Course c схемой courseSchema
module.exports = model('Course', courseSchema)