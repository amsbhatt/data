/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var interaction = require('./routes/interactions');
var sessionStorage = require('./models/session');
var http = require('http');
var path = require('path');
var ipinfo = new (require('node-ipinfodb'))('8a43349615008fef211172406e5ad59d90a07183cdf6e53524cbbe46d25cb350');

app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('ipinfo', ipinfo);
app.use(function(req, res, next) {
  console.info('req domain', req.headers.origin)
  res.header('Access-Control-Allow-Origin',      '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods',     'GET,POST');
  res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
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
app.use(ipinfo);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/interactions', function(req, res) {
  sessionStorage.currentSession.create(req, function(response) {
    console.info('session request', req.session)
    //listen to response for session_id before creating interactions
    if (response) {
      interaction.create(response, req, res);
      res.send(200);
    }
  });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
