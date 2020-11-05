const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) => {
  const courses = await Course.find()
    // использование референции к модели User, второй параметр - необзодимые поля
    .populate('userId', 'email name')
    // поля которые необходимо достать (по умолчанию все)
    .select('price title img')

  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }


  const course = await Course.findById(req.params.id)



  res.render('course-edit', {
    title: `Редактировать ${course.title}`,
    course
  })
})

router.post('/edit', async (req, res) => {
  await Course.findByIdAndUpdate(req.body.id, req.body)
  res.redirect('/courses')
})

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

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id)
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course
  })
})

module.exports = router