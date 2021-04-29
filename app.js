var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var http = require('http');
var dotenv = require('dotenv');
const Chat = require('./models/chat');
const Pusher = require('pusher');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chatRouter');
// var leaderRouter = require('./routes/leaderRouter');
// var promoRouter = require('./routes/promoRouter');
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



// connect.then((db) => {
// 	console.log("Connected correctly to the server");
//   let chatMessage = new Chat({sender:'',message:''});
//   chatMessage.save();
// }, (err) => {
// 	console.log(err)  
// })

//set up pusher
const pusher = new Pusher({
  appId:process.env.PUSHER_APP_ID ,
  key:process.env.PUSHER_APP_KEY ,
  secret: process.env.PUSHER_APP_SECRET,
  cluster:process.env.PUSHER_APP_CLUSTER ,
  useTLS: true
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
const port = process.env.PORT || "3000";
app.set("port", port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cookieParser('12345-67890-09876-54321'));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/chat', chatRouter);
// app.use('/leaders', leaderRouter);
// app.use('/promotions', promoRouter);

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

const server = http.createServer(app);
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port: http://localhost:${port}/`)
});


module.exports = app;