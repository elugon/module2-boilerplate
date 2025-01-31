require('dotenv').config();
require('./db');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// Routers require
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const allCoinsRouter = require ('./routes/all-coins')
const profileRouter = require ('./routes/profile')
const favoritesRouter = require ('./routes/favorites')
const selectFavoritesRouter = require ('./routes/select-favorites')
const coinDetailRouter = require ('./routes/coin-detail')
const commentsRouter = require ('./routes/comments')
const app = express();

// cookies and loggers
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// For deployment
app.set('trust proxy', 1);
app.use(
  session({
    name: 'project2-cookie',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 2592000000 // 30 days in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL
    })
  }) 
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Helpers
const hbs = require('hbs');

hbs.registerHelper('timeFix', function(str){
let string=str.toString();  
let year=string.slice(11,15);
let month=string.slice(4,7);
let day=string.slice(8,10);
let months={Jan:"January",Feb:"February",Mar:"March",Apr:"April",May:"May",Jun:"June",Jul:"July",Aug:"August",Sep:"September",Oct:"October",Nov:"November",Dec:"December"}
Object.entries(months).forEach(ele => {
  const [key, value] = ele;
  if(key===month){
    month=value
  }
})
  return `Published on ${month} ${day}, ${year}.`
  })

hbs.registerHelper('capitalizeFirstLetter', function(str){
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized;
    })
     
// routes intro
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/all-coins', allCoinsRouter);
app.use('/favorites', favoritesRouter);
app.use('/select-favorites', selectFavoritesRouter);
app.use('/profile', profileRouter);
app.use('/coin-detail', coinDetailRouter)
app.use('/comments', commentsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  if (err.status === 404) {
    res.render('404', { path: req.url });
  } else {
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
