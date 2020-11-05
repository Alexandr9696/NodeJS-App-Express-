const {Router} = require('express')
const Course = require('../models/course')
const auth = require('./../middleware/auth')
const router = Router()


function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    // все курсы в базе данных
    const courses = await Course.find()
      // использование референции к модели User, второй параметр - необходимые поля
      .populate('userId', 'email name')
      // поля которые необходимо достать (по умолчанию все) из модели Course
      .select('price title img')

    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses
    })
  } catch (e) {
    console.log(e)
  }
})

// редактировать курс
router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  try {
    // поиск конректного курса по id
    const course = await Course.findById(req.params.id)

    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }

    res.render('course-edit', {
      title: `Редактировать ${course.title}`,
      course
    })
  } catch (e) {
    console.log(e)
  }
})

// обновление (редактирование) курса
router.post('/edit', auth, async (req, res) => {
  try {
    const {id} = req.body
    delete req.body.id
    const course = await Course.findById(id)
    if (isOwner(course, req)) {
      return res.redirect('/courses')
    }
    // поиск и обновление
    Object.assign(course, req.body)
    course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

// удалить курс
router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    })
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

// открыть курс
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    res.render('course', {
      layout: 'empty',
      title: `Курс ${course.title}`,
      course
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router