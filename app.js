var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var log = require('morgan');
var logger = require(__dirname + "/modules/helpers/log");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var compress = require('compression');
var cors = require('cors');
var mongoose = require('mongoose');

var globals = require(__dirname + '/modules/helpers/globals');
var routes = require('./routes/index');
var cabs = require('./routes/cabs');
var eta = require('./routes/eta');
var booking = require('./routes/booking');
var api = require('./routes/api');
var users = require('./routes/users');

var app = express();
app.use(compress());


// DB Connection
var dbUrl = globals.getDBUrl();
mongoose.connect('mongodb://' + dbUrl, function(err) {
    if (err) {
        logger.error('connection error', err);
    } else {
        logger.info('DB Connected Successfully');
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
logger.debug("Overriding 'Express' logger");
app.use(log('dev'))
app.use(session({
    secret: 'TaxiStop@Ch@n@ky@',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
var oneYear = 31557600000;
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: oneYear
}));
if (process.env.NODE_ENV !== 'production')
    app.use(express.static(path.join(__dirname, 'src')));

app.use('/', routes);
app.use('/cabs', cors(), cabs);
app.use('/eta', eta);
app.use('/booking', booking);
app.use('/devapi', api);
app.use('/users', users);

app.get('/map', function(req, res) {
    var src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=' + globals.getGmapsAPI();
    res.append("Content-Type", "text/javascript; charset=UTF-8");
    res.send("(function() {document.write('<' + 'script src=\"" + src + "\"><' + '/script>');}());");
});

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
