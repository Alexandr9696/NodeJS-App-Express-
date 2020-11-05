const express = require('express')
const path = require('path')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/cart')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

// конфигурация handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})

// регистрируем движок handlebars
app.engine('hbs', hbs.engine)
// использование handlebars
app.set('view engine', 'hbs')
app.set('views', 'views')

// добавление в объект request пользователя
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5f8f56a9662b8518942f0822')
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cardRoutes)


const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = `mongodb+srv://alexandr:JY5YZxo0AkHqPFOj@cluster0.nlkzc.mongodb.net/shop`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    // проверка если ли пользователи
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'alexandr@mail.ru',
        name: 'Alexandr',
        cart: {items: []}
      })
      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()








