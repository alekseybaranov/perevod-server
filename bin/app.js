// ----------------------------------------------------------------------------
// Системные модули
//


// ----------------------------------------------------------------------------
// Сторонние модули
//

// модули сервера express и шаблонизатора handlebars
//
const express = require(`express`),
      hbs     = require(`express-handlebars`);




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
      
export default app