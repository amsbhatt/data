var pg = require('pg')
  , hstore = require('pg-hstore')
  , conString = process.env.HEROKU_POSTGRESQL_BROWN_URL || "postgres://postgres@localhost/dna"
  , $ = require('jquery');

exports.currentSession = {
  create: function(req, callback) {
    var self = this;
    var ip_address = req.ip;
    console.info('req ip', ip_address)
    //----- stub for local testing
//    this.getIpInfo("4.17.99.0", function(result){
    this.getIpInfo(ip_address, function(result) {
      self.query(result, req.sessionID, function(response) {
        callback(response);
      });
    });
  },

  query: function(data, sessionId, callback) {
    console.info('in query');
    pg.connect(conString, function(err, client, done) {
      if (err) {
        return console.error('error connecting to database', err);
      }
      var dataHash = hstore.stringify(data);
      // Check to see if the session already exists
      client.query("SELECT id from sessions where key='" + sessionId + "';", function(err, response) {
        if (err) {
          return console.error('error querying id', err);
        }
        // if session exists, pull id from db and return to callback
        if (response && !!(response.rows[0] && response.rows[0].id)) {
          done();
          callback(response.rows[0].id);
          // if session does not exist, write to db, and return id to callback
        } else {
          client.query("INSERT INTO sessions (key, data) VALUES ('" + sessionId + "','" + dataHash + "') RETURNING id;", function(err, res) {
            done();
            if (err) {
              return console.error("error inserting session", err);
            }
            if (res && res.rows[0].id) {
              callback(res.rows[0].id);
            }
          });
        }
      });
    });
  },

  getIpInfo: function(ip_address, callback) {
    var ipInfoModule = app.get('ipinfo');
    ipInfoModule.getLocation(ip_address, function(err, results) {
      console.info('results', results)
      if (results) {
        callback(results);
      }
    });
  }
};