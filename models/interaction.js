DNAlibs = require('./index');
var pg = DNAlibs.pg
  , hstore = DNAlibs.hstore
  , conString = DNAlibs.conString
  , $ = DNAlibs.$
  , newUser = require('./user');

var pgQuery = function (query, callback) {
  pg.connect(conString, function (err, client) {
    if (err) {
      callback && callback(err);
    }
    client.query(query, function (err, result) {
      callback && callback(err, result);
      client.end();
    });
  })
};

//Specify valid action/category values
var actionValidation = ['click', 'visit'];
var categoryValidation = ['widget', 'button', 'page', 'link', 'input', 'image', 'text_field', 'opengraph', 'scroll', 'message', 'header'];

var validParams = function (req) {
  var validAction = (actionValidation.indexOf(req.action) > -1);
  var validCategory = (categoryValidation.indexOf(req.category) > -1);
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

exports.create = function (sessionId, req) {
  if (req.method == 'POST') {
    var data = req.body;

    if (validParams(data)) {
      var userData = data.userInfo;
      delete data.userInfo;

      if (data && data.data) {
        $.each(data.data, function (key, value) {
          if (!!key.match('dna')) {
            data.data[key.replace('dna', '').toLowerCase()] = value;
            delete data.data[key]
          }
        });
      }

      //Add default url data
      var defaults = $.extend(data.data, defaultData(req.headers['referer']));

      //Add session_id and defaults to interaction
      $.extend(data, {session_id: sessionId, data: defaults });

      if (userData && userData.uid) {
        newUser.user.create(userData, function (user_id) {
          $.extend(data, {user_id: user_id});
          pgQuery("INSERT INTO interactions (" + formattedQuery(data).keys + ") VALUES (" + formattedQuery(data).values + ");");
        });
      } else {
        pgQuery("INSERT INTO interactions (" + formattedQuery(data).keys + ") VALUES (" + formattedQuery(data).values + ");");
      }
    } else {
      return console.log('User information does not exist or action and/or category are not valid types - category: ' + data.category + ', action: ' + data.action);
    }
  }
};