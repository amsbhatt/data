DNAlibs = require('./index');
var pg = DNAlibs.pg
  , hstore = DNAlibs.hstore
  , conString = DNAlibs.conString
  , $ = DNAlibs.$;

var appVersion = function(userAgent) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  } else {
    return 'desktop';
  }
};

exports.currentSession = {
  create: function(req, callback) {
    var self = this;
    var ip_address = this.getClientIp(req);
    //----- stub for local testing
//    this.getIpInfo("4.17.99.0", function(result){
    var ua = req.headers['user-agent'];
    this.getIpInfo(ip_address, function(result) {
      $.extend(result, {
        user_agent: ua,
        app_version: appVersion(ua)
      });
      delete result.statusCode;
      delete result.statusMessage;
      self.query(result, req.sessionID, function(response) {
        callback(response);
      });
    });
  },

  query: function(data, sessionId, callback) {
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
          client.query("INSERT INTO sessions (key, created_at, data) VALUES ('" + sessionId + "','" + new Date().toISOString() + "','" + dataHash + "') RETURNING id;", function(err, res) {
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