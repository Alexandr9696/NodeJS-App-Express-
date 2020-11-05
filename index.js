const express = require('express')
const path = require('path')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/cart')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

// конфигурация handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})

// регистрирация движка handlebars
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

// статические файлы
app.use(express.static(path.join(__dirname, 'public')))
// urlencoded - это метод, встроенный в express для распознавания входящего объекта запроса в виде строк или массивов
app.use(express.urlencoded({extended: true}))
// маршрутизация
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cardRoutes)
app.use('/orders', ordersRoutes)


const PORT = process.env.PORT || 3000

async function start() {
  try {
    // подключение к базе данных MongoDB через mongoose
    const url = `mongodb+srv://alexandr:JY5YZxo0AkHqPFOj@cluster0.nlkzc.mongodb.net/shop`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    // проверка есть ли пользователи
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'alexandr@mail.ru',
        name: 'Alexandr',
        cart: {items: []}
      })
      // обновление объекта модели User
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








