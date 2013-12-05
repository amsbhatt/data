DNAlibs = require('./index');
var pg = DNAlibs.pg
  , hstore = DNAlibs.hstore
  , conString = DNAlibs.conString
  , $ = DNAlibs.$
  , newUser = require('./user');

var pgQuery = function (query, success, fail) {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      fail && fail(err);
      return console.error('could not connect to database', err)
    }
    client.query(query, function (err, result) {
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
var categoryValidation = ['button', 'page', 'link', 'input', 'image', 'text_field'];

var validParams = function (req) {
  var validAction = (actionValidation.indexOf(req.body.action) > -1);
  var validCategory = (categoryValidation.indexOf(req.body.category) > -1);
  return !!(validAction && validCategory);
};

//Default data
var defaultData = function (urlPath) {
  var trackingRegex = urlPath.match(/(t=|tracking_id=)([^&]*)/);
  var trackingId = trackingRegex && trackingRegex[2];

//Set default data here
  return returnData = {
    tracking_id: trackingId, url: urlPath
  };
};

//Formatted query Keys/Values
var formattedQuery = function (data) {
  var keys = Object.keys(data);
  var keyString = keys.join(",");
  var values = [];
  keys.forEach(function (key) {
    if (typeof data[key] === "object") {
      hstore.stringify(data[key], function (result) {
        values.push("'" + result + "'");
      })
    } else {
      values.push("'" + data[key] + "'");
    }
  });
  var valueString = values.join(",");
  return {'keys': keyString, 'values': valueString};
};

exports.create = function (sessionId, req, res) {
  if (req.method == 'POST') {
    var success = function (result) {
      res.send([result, req.query ]);
    };
    var fail = function (result) {
      return console.error("a failure occurred", result);
    };

    var data = req.body;
    var userData = req.body.userInfo;
    delete data.userInfo;

    //Add default url data
    $.extend(data.data, defaultData(req.headers['referer']));
    var defaults = $.extend(data.data, {target_id: data.target_id} );

    //Add session_id and defaults to interaction
    $.extend(data, {session_id: sessionId, data: defaults });
    delete data.target_id;

    if (userData.uid && validParams(req)) {
      newUser.user.create(userData, function (user_id) {
        $.extend(data, {user_id: user_id});
        pgQuery("INSERT INTO interactions (" + formattedQuery(data).keys + ") VALUES (" + formattedQuery(data).values + ");", success, fail)
      });
    } else if (validParams(req)) {
      pgQuery("INSERT INTO interactions (" + formattedQuery(data).keys + ") VALUES (" + formattedQuery(data).values + ");", success, fail)
    } else {
      return console.log('User information does not exist or action and/or category are not valid types - category: ' + data.category + ', action: ' + data.action);
    }
  }
};