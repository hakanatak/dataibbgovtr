let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let maki = require('maki');
let indexRouter = require('./routes/index');
let garajRouter = require('./routes/garaj');
let durakRouter = require('./routes/durak');
let duyuruRouter = require('./routes/duyuru');
let filoRouter = require('./routes/filo');
let cors = require('cors');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware setup
app.use(logger('dev')); // Logging requests
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parses incoming URL-encoded data
app.use(cookieParser()); // Parses cookies from requests
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files

// Routes setup
app.use('/', indexRouter); // Home route
app.use('/api/garaj', garajRouter); // Garaj route
app.use('/api/durak', durakRouter); // Durak route
app.use('/api/duyuru', duyuruRouter); // Duyuru route
app.use('/api/filo', filoRouter); // Filo route

app.use(cors());  // CORS'u etkinleştir


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404)); // If route is not found, forward to error handler
});

// Error handler middleware
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development mode
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500); // Set the response status code
  res.render('error'); // Render the error page with the error details
});

module.exports = app;
