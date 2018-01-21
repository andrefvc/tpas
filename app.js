var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerV1.json');
const swaggerDocumentV2 = require('./swaggerV2.json');
var passport = require('passport');
var session = require('express-session');
var http = require('http');



//rotas v1
var routes = require('./routes/api/v1/index');
var viagens = require('./routes/api/v1/viagens');
var momentos = require('./routes/api/v1/momentos');
var locals = require('./routes/api/v1/locals');
var weathers = require('./routes/api/v1/weathers');
var files = require('./routes/api/v1/files');

//rotas v2
var viagensv2 = require('./routes/api/v2/viagens');
var momentosv2 = require('./routes/api/v2/momentos');
var localizacao = require('./routes/api/v2/localizacao');
var classificacao = require('./routes/api/v2/classificacao');
var comentarios = require('./routes/api/v2/comentarios');
var utilizadores = require('./routes/api/v2/utilizadores');
var bucketlist = require('./routes/api/v2/bucketlist');
var notificacoes = require('./routes/api/v2/notificacoes');
var inscricaoViagem = require('./routes/api/v2/inscricaoViagem');

//Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(fileUpload());

//Passport
var passport = require('passport');
require('./config/passport')(passport); // pass passport for configuration

//Cookie and session
app.use(session({
  secret: 'this is the secret',
  name: "TripsTogetherSession",    
  resave: true,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//Body-parser
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
}));

//swagger
var options = {};
var customCss = '.topbar { display: none }';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, false, options, customCss, '../favicon.ico'));
app.use('/api/v2/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentV2, false, options, customCss, '../../../favicon.ico'));

//rotas v1
app.use('/', routes);
app.use('/viagens', viagens);
app.use('/momentos', momentos);
app.use('/locals', locals);
app.use('/weather', weathers);
app.use('/files', files);

// rotas v2
app.use('/api/v2/viagens', viagensv2);
app.use('/api/v2/momentos', momentosv2);
app.use('/api/v2/localizacao', localizacao);
app.use('/api/v2/classificacao', classificacao);
app.use('/api/v2/comentarios', comentarios);
app.use('/api/v2/utilizadores', utilizadores);
app.use('/api/v2/bucketlist', bucketlist);
app.use('/api/v2/notificacoes', notificacoes);
app.use('/api/v2/inscricaoViagem', inscricaoViagem);

// routes auth ======================================================================
require('./routes/api/v2/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport



var tools = require(path.join(__dirname, 'tools'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Rota não encontrada');
  err.status = 404;
  err.ErrorCode = 404;
  //next(err);
  res.status(404).jsonp(tools.parseError(err));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    /*
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });    
    */
    console.dir(err);
    res.status(err.status || 500).jsonp(tools.parseError(err));
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  /*
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
  */
  console.dir(err);
  res.status(err.status || 500).jsonp(tools.parseError(err));
});



module.exports = app;
