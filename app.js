var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var log = require('morgan');
var logger = require(__dirname + "/modules/log");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');

var globals = require(__dirname + '/modules/globals');
var routes = require('./routes/index');
var cabs = require('./routes/cabs');
var eta = require('./routes/eta');
var booking = require('./routes/booking');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
logger.debug("Overriding 'Express' logger");
app.use(log('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/cabs', cabs);
app.use('/eta', eta);
app.use('/booking', booking);

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
            title: globals.getAppTitle(),
            url: {
                cdnImagePrefix: globals.getCDNUrlPrefix
            },
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
        title: globals.getAppTitle(),
        url: {
            cdnImagePrefix: globals.getCDNUrlPrefix
        },
        message: err.message,
        error: {}
    });
});

module.exports = app;
