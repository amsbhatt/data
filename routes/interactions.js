/* Interactions Route */

var pg = require('pg')
  , hstore = require('pg-hstore')
  , conString = process.env.HEROKU_POSTGRESQL_BROWN_URL || "postgres://postgres@localhost/dna"
  , $ = require('jquery');

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

exports.create = function(sessionId, req, res) {
  if (req.method == 'POST') {
    var success = function(result) {
      res.send([result, req.query ]);
    };
    var fail = function(result) {
      return console.error("a failure occurred", result);
    };
    var data = req.body;
    $.extend(data, {session_id: sessionId});
    var keys = Object.keys(data);
    var keyString = keys.join(",");
    var values = [];
    keys.forEach(function(key) {
      if (typeof data[key] === "object") {
        hstore.stringify(data[key], function(result){
          values.push("'" + result + "'");
        })
      } else {
        values.push("'" + data[key] + "'");
      }
    });
    var valueString = values.join(",");
    pgQuery("INSERT INTO interactions (" + keyString + ") VALUES (" + valueString + ");", success, fail)
  }
};