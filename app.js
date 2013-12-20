/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var session = require('./models/session');
var interaction = require('./models/interaction');
var http = require('http');
var path = require('path');

app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(function(req, res, next) {
  if (req) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  }
  next();
});
app.use(express.cookieParser());
app.use(express.session({
  secret: 'blahblah'
}));
express.favicon();
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/interactions', function(req, res) {
  session.create(req, function(err, response) {
    //listen to response for session_id before creating interactions
    if (response) {
      interaction.create(response, req, res);
    }
  });
  res.end();
});

//USING ENGINE.IO

//var engine = require('engine.io')
//  , http = require('http').createServer(app).listen(app.get('port'))
//  , server = engine.attach(http);
//
//server.on('connection', function(socket) {
//  console.info('socket exists!!!!', socket)
//  socket.emit('im connected!!!!!')
//  socket.on('close', function(response, req, res){
//    interaction.create(response, req, res);
//  });
//});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
