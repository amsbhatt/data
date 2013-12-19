var pg = require('pg'),
  hstore = require('pg-hstore'),
  conString = process.env.DATABASE_URL || "postgres://postgres@localhost/dna",
  $ = require('jquery');

exports.pgQuery = function (query, callback) {
  pg.connect(conString, function (err, client) {
    if (err || !client) {
      callback && callback(err || "No client found");
      client.end();
    } else {
      client.query(query, function (err, result) {
        callback && callback(err, result);
        client.end();
      });
    }
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