const {Router} = require('express')
const Course = require('../models/course')
const router = Router()


router.get('/', async (req, res) => {
  // все курсы в базе данных
  const courses = await Course.find()
    // использование референции к модели User, второй параметр - необходимые поля
    .populate('userId', 'email name')
    // поля которые необходимо достать (по умолчанию все) из модели Course
    .select('price title img')

  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

// редактировать курс
router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }
  // поиск конректного курса по id
  const course = await Course.findById(req.params.id)

  res.render('course-edit', {
    title: `Редактировать ${course.title}`,
    course
  })
})

// обновление (редактирование) курса
router.post('/edit', async (req, res) => {
  const {id} = req.body
  delete req.body.id
  // поиск и обновление 
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

// удалить курс
router.post('/remove', async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id
    })
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

// открыть курс
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id)
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course
  })
})

module.exports = router