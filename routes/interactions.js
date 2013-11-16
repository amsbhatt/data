/* Interactions Route */

var pg = require('pg')
  , conString = "postgres://postgres@localhost/dna";

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
      }
      if (result) {
        success && success(result);
      }
    });
  })
};

exports.create = function(req, res) {
  if (req.method == 'POST') {
    var success = function(result) {
      res.send([result, req.query ]);
    };
    var fail = function(result) {
      return console.error("a failure occurred", result);
    };
    var data = req.body
    var keys = Object.keys(data);
    var keyString = keys.join(",");
    var values = [];
    keys.forEach(function(key) {
      values.push("'" + data[key] + "'");
    });
    var valueString = values.join(",");
    pgQuery("INSERT INTO interactions (" + keyString + ") VALUES (" + valueString + ");", success, fail)
  }
};