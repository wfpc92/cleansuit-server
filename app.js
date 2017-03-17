
var express 		= require('express');
var compression     = require('compression');
var path           	= require('path');
var favicon 		= require('serve-favicon');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var flash    		= require('connect-flash');
var passport 		= require('passport');
var session  		= require('express-session');
var mongoose 		= require('mongoose');

var app = express();

function runapp() {
    // registra los modelos del API
    require('./models')(app);

    require('./config/auth')(passport); // pass passport for configuration
    require('./config/multer')(); // verificar que exista carpeta para guardar imagenes

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(compression());
    app.use(express.static(path.join(__dirname, 'public')));

    // required for passport
    //app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

    //configurar rutas del API
    require('./routes/config')(app, passport);

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
      	res.render('pages/error', {
      	  message: err.message,
      	  error: err
      	});
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('pages/error', {
        message: err.message,
        error: {}
      });
    });
}

require('./config/database')(mongoose, runapp);

module.exports = app;
