DNAlibs = require('./index');
var pg = DNAlibs.pg
  , conString = DNAlibs.conString
  , $ = DNAlibs.$;


exports.user = {
  create: function (data, callback) {
    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error connection to database', err);
      };
      client.query("SELECT id from users where client_id='" + data.uid + "';", function (err, response) {
        if (err) {
          return console.error('error querying id');
        };
        //if user exists return respective id
        if (response && !!(response.rows[0] && response.rows[0].id)) {
          done();
          callback(response.rows[0].id);
        } else {
          client.query("INSERT into users (client_id) VALUES ('" + data.uid + "') RETURNING id;", function (err, res) {
            done();
            if (err) {
              return console.error('error inserting user into database', err);
            };
            if (res && res.rows[0].id) {
              callback(res.rows[0].id);
            }
          })
        }
      });
    })
  }
};