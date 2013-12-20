var pg = require('pg'),
  conString = process.env.DATABASE_URL || "postgres://postgres@localhost/dna",
  $ = require('jquery');

exports.pgQuery = function (query, params, callback) {
  callback = callback || params || function() {};
  params = callback && params || [];
  var client = new pg.Client(conString);
  client.connect(function(err) {
    if(err) {
      return callback && callback(err);
    }
    client.query(query, params, function(err, res) {
      callback && callback(err, res);
      client.end();
    });
  })
};

exports.parse = function (val) {
  var pattern, regex, result, match, key, value, escapeCR;
  pattern = '("(?:\\\\\"|[^"])*?")\\s*=>\\s*((?:"(?:\\\\\"|[^"])*?")|NULL)';
  regex = new RegExp(pattern, 'gi');
  // escape new lines, tabs and carriage returns from html which cause JSON.parse errors
  escapeCR = function (str) {
    return str.replace(/\n|\r\n|\t/g, "\\n");
  };
  result = {};
  match = null;
  while ((match = regex.exec(val)) != null) {
    try {
      key = JSON.parse(match[1]);
      value = match[2] == "NULL" ? null : JSON.parse(escapeCR(match[2]));
      result[key] = value;
    } catch (e) {
      console.info("NODE-POSTGRES-HSTORE COULD NOT PARSE", (e.stack || e.message), key, value);
    }
  }
  return result;
};


exports.stringify = function(val) {
  var result = Object.keys(val).map(function(key) {
    var value = val[key];
    value = value === null ? 'NULL' : JSON.stringify(value.toString());
    return '"' + key + '" => ' + value;
  }).join(', ');


  return result;
};

//exports.pgQuery = function (query, callback) {
//  pg.connect(conString, function (err, client) {
//    if (err || !client) {
//      callback && callback(err || "No client found");
//      client.end();
//    } else {
//      client.query(query, function (err, result) {
//        callback && callback(err, result);
//        client.end();
//      });
//    }
//  })
//};