// ----------------------------------------------------------------------------
// Системные модули
//

const path = require('path')


// ----------------------------------------------------------------------------
// Сторонние модули
//

// модули сервера express и шаблонизатора handlebars
//
const express = require(`express`),
      hbs     = require(`express-handlebars`)

// промежуточное ПО
//
const body = require('body-parser')         // ?
const cookie = require('cookie-parser')     // ?
const morgan = require('morgan')            // журналирование

// модуль создания уникальных идентификаторов
//
const uuid = require('uuid/v4')


// ----------------------------------------------------------------------------
// Собственные модули
//
//const app = require('./app')



// ----------------------------------------------------------------------------
// Используемые каталоги
//

// каталог сервера
//
let serverDir = __dirname.replace(/\\/g, '/').toLowerCase()
console.log('\nserverDir   ==> ', serverDir)

// каталог проекта
//
let baseDir = path.dirname(serverDir)
console.log('baseDir     ==> ', baseDir)

// каталог статических  файлов
//
let publicDir = baseDir + `/public`
console.log('publicDir   ==> ', publicDir)

// каталог представлений
//
let viewsDir = baseDir + `/views`
console.log('viewsDir    ==> ', viewsDir)

// каталог шаблонов
//
let layoutsDir = baseDir + `/views/layouts`
console.log('layoutsDir  ==> ', layoutsDir)

// каталог частичных шаблонов
//
let partialsDir = baseDir + `/views/partials`
console.log('partialsDir ==> ', partialsDir)

// каталог журналов
//
let logDir = baseDir + `/log`
console.log('logDir      ==> ', logDir)







const app = express()

// Подключаем шаблонизатор Handlebars
//
app.set('views', viewsDir)                      // каталог представлений
app.engine(`hbs`, hbs( {
  extname: `hbs`,                               // расширение файлов-шаблонов
  defaultLayout: `main`,                        // основной шаблон
  layoutsDir: layoutsDir,                       // каталог шаблонов
  partialsDir: partialsDir,                     // каталог частичных шаблонов
  helpers: {                                    // механизм "секций"
    section: function(name, options){
      if(!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    }
  }
}))
app.set('view engine', 'hbs')

// Подключаем промежуточное ПО журналирования
//
switch(app.get('env')){
  case 'development':
    // модуль 'morgan'
    // поддерживает сжатое многоцветное журналирование для разработки
    app.use(require('morgan')('dev'))
    break
  case 'production':
    // модуль 'express-logger'
    // поддерживает ежедневное чередование файлов журналов
    app.use(require('express-logger')({
      path: logDir + '/requests.log'
    }))
    break
  }



app.set('port', process.env.PORT || 3001)   // порт по умолчанию - 3001




// ----------------------------------------------------------------------------
// Подключаем обработку статических файлов для нужд сервера
//
app.use(express.static(publicDir));         // каталог статических файлов

// ----------------------------------------------------------------------------
// Пользовательская страница '/'
//
app.get('/', function(req, res) {
  res.render('home');
});

// ----------------------------------------------------------------------------
// Пользовательская страница '/users'
//
const users = {};     // массив? пользователей
const ids = {};       // массив? cookies

app.get('/users', function (req, res) {
  const scorelist = Object.entries(users)
    .sort((l, r) => l.score - r.score)
    .map(user => {
      return {
        email: user.email,
        age: user.age,
        score:user.score,
      }
    });

  res.json(scorelist);
});



// ----------------------------------------------------------------------------
// Пользовательская страница /about
//
app.get('/about', function(req, res) {
  res.render('about');
});

// ----------------------------------------------------------------------------
// Пользовательская страница 404
// (промежуточное ПО)
//
app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});

// ----------------------------------------------------------------------------
// Пользовательская страница 500
// (промежуточное ПО)
//
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), function() {
  console.log('\nСервер Express запущен в режиме ' + app.get('env') +
              '\nпо адресу http://localhost:' + app.get('port') +
              '\nдля завершения работы сервера нажните Ctrl+C.')
})