var lib = require('../lib/index')
  , $ = require('jquery')
  , hstore = require('pg-hstore')
  , newUser = require('./user');

//Specify valid action/category values
var actionValidation = ['click', 'visit', 'submit'];
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

var insertValues = function(length) {
  var valuesArray = [];
  for (i = 0;i < length; i++) {
   valuesArray.push("$"+(i+1))
  }
  return valuesArray.join(", ")
};

exports.create = function (sessionId, req, callback) {
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

    var dataKeys = ["category", "object", "action", "created_at", "session_id", "data", "media_id", "access_token"];
    var dataArray = [data.category, data.object, data.action, "'" + data.created_at + "'", data.session_id, lib.stringify(data.data), data.media_id, data.access_token];

    if (userData && userData.uid) {
      newUser.create(userData, function (err, user_id) {
        dataKeys.push("user_id");
        dataArray.push(user_id);

        lib.pgQuery('INSERT INTO interactions (' + dataKeys.join(', ') + ') VALUES (' + insertValues(dataArray.length) + ')', dataArray, function (err, res) {
          if (err) {
            return callback && callback(err, res);
          }
          callback && callback(err, res);
        });
      });
    } else {
      lib.pgQuery("INSERT INTO interactions (" + dataKeys.join(",") + ") VALUES (" + insertValues(dataArray.length) + ")", dataArray, function (err, res) {
        if (err) {
          return callback && callback(err, res);
        }
        callback && callback(err, res);
      });
    }
  } else {
    var error = 'User information does not exist or action and/or category are not valid types - category: ' + data.category + ', action: ' + data.action;
    callback && callback(error, null);
  }
};