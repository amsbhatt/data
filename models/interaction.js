DNAlibs = require('./index');
var pg = DNAlibs.pg;
var hstore = DNAlibs.hstore;
var conString = DNAlibs.conString;
var $ = DNAlibs.$;

var pgQuery = function(query, success, fail) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      fail && fail(err);
      return console.error('could not connect to database', err)
    }
    client.query(query, function(err, result) {
      done();
      if (err) {
        fail && fail(err);
        return console.error('could not connect to database', err)
      }
      if (result) {
        success && success(result);
      }
    });
  })
};

//Specify valid action/category values
var actionValidation = ['click', 'visit'];
var categoryValidation = ['button', 'page'];

var validParams = function(req) {
  var validAction = (actionValidation.indexOf(req.body.action) > -1);
  var validCategory = (categoryValidation.indexOf(req.body.category) > -1);
  return !!(validAction && validCategory);
};

//Default data
var defaultData = function(urlPath) {
  var trackingRegex = urlPath.match(/(t=|tracking_id=)([^&]*)/);
  var trackingId = trackingRegex && trackingRegex[2];

//Set default data here
  return returnData = {
    tracking_id: trackingId, url: urlPath
  };
};

exports.create = function(sessionId, req, res) {
  if (req.method == 'POST') {
    var success = function(result) {
      res.send([result, req.query ]);
    };
    var fail = function(result) {
      return console.error("a failure occurred", result);
    };

    var data = req.body;
    //Get default info about user's browser
    var defaults = defaultData(req.headers['referer']);

    if (validParams(req)) {
      //Add session_id to interaction
      $.extend(data, {session_id: sessionId, data: defaults});
      var keys = Object.keys(data);
      var keyString = keys.join(",");
      var values = [];
      keys.forEach(function(key) {
        if (typeof data[key] === "object") {
          hstore.stringify(data[key], function(result) {
            values.push("'" + result + "'");
          })
        } else {
          values.push("'" + data[key] + "'");
        }
      });
      var valueString = values.join(",");
      //Insert interaction
      pgQuery("INSERT INTO interactions (" + keyString + ") VALUES (" + valueString + ");", success, fail)
    } else {
      return console.error('action and/or category are not valid types - category: ' + data.category + ', action: ' + data.action);
    }
  }
};