var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
var Pusher = require('pusher');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chatRouter');
var chatRoomRouter = require('./routes/chatRoomRouter');
var corsOptions={origin:'htpp://localhost:4200'};
var dotenv = require('dotenv');
dotenv.config();

// connect to mongodb
const mongoose = require('mongoose');
mongoose.connect(process.env.MDB_CONNECT,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},(err)=>{
  if(err)return console.err(err);
  console.log("Connected to MongoDB");
});

// connect to pusher
const pusher = new Pusher({
  appId:     process.env.PUSHER_APP_ID,
  key:       process.env.PUSHER_APP_KEY,
  secret:    process.env.PUSHER_APP_SECRET,
  cluster:   process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Session middleware
app.use(session({
  secret: 'somesuperdupersecret',
  resave: true,
  saveUninitialized: true
}))
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set up routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use('/chatRoom',chatRoomRouter);

app.use(express.static(path.join(__dirname, 'public')));

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;