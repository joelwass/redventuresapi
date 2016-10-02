var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV != undefined && process.env.NODE_ENV.indexOf('local') != -1) {

  // in local or dev, display swagger api
  const swaggerJSDoc = require('swagger-jsdoc');

  // swagger definition
  var swaggerDefinition = {
    info: {
      title: 'Red Ventures API Docs',
      version: '1.0.0',
      description: 'red-ventures-api Swagger',
    },
    host: 'localhost:3001',
    basePath: '/',
  };

  var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./api/controllers/*.js'],
  };

  var swaggerSpec = swaggerJSDoc(options);

  // serve swagger
  app.get('/swagger.json', function(req, res) {
    console.log("remote address: " + req._remoteAddress);
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
