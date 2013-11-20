var pg = require('pg')
  , hstore = require('pg-hstore')
  , conString = "postgres://postgres@localhost/dna"
  , $ = require('jquery');

exports.currentSession = {
  create: function(req) {
    var self = this;
    var ip_address = this.getClientIp(req);
//    var ip_info = this.getIpInfo("4.17.99.0", function(result){ ----- stub for local testing
    this.getIpInfo(ip_address, function(result) {
      self.query(result, req.sessionID);
    });
  },

  query: function(data, sessionId) {
    pg.connect(conString, function(err, client, done) {
      if (err) {
        return console.error('error connecting to database', err);
      }
      var dataHash = hstore.stringify(data);
      client.query("SELECT count(*) from sessions where key='" + sessionId + "';", function(err, res) {
        if (err) {
          return console.error('error querying count', err);
        }
        if (res && (res.rows[0].count != 1)) {
          client.query("INSERT INTO sessions (key, data) VALUES ('" + sessionId + "','" + dataHash + "');", function(err, res) {
            done();
            if (err) {
              return console.error("error inserting session", err);
            }
          });
        }
      });
    });
  },

  getClientIp: function(req) {
    var ipAddress;
    // The request may be forwarded from local web server.
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
      // 'x-forwarded-for' header may return multiple IP addresses in
      // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
      // the first one
      var forwardedIps = forwardedIpsStr.split(',');
      ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
      // If request was not forwarded
      ipAddress = req.connection.remoteAddress;
    }
    return ipAddress
  },

  getIpInfo: function(ip_address, callback) {
    var ipInfoModule = app.get('ipinfo');
    ipInfoModule.getLocation(ip_address, function(err, results) {
      if (results) {
        callback(results);
      }
    });
  }
};