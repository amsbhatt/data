DNAlibs = require('./index');
var pg = DNAlibs.pg
  , hstore = DNAlibs.hstore
  , conString = DNAlibs.conString
  , $ = DNAlibs.$
  , geoip = require('geoip-lite');

var appVersion = function (userAgent) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  } else {
    return 'desktop';
  }
};

var getClientIp = function (req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  if (req && req.header) {
    var forwardedIpsStr = req.header('x-forwarded-for');
  }
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
};

var query = function (data, sessionId, callback) {
  pg.connect(conString, function (err, client) {
    if (err) {
      callback && callback(err)
    }
    var dataHash = hstore.stringify(data);
    // Check to see if the session already exists
    client.query("SELECT id from sessions where key='" + sessionId + "';", function (err, response) {
      if (err) {
        callback && callback(err);
      }
      // if session exists, pull id from db and return to callback
      if (response && !!(response.rows[0] && response.rows[0].id)) {
        callback(response.rows[0].id);
        // if session does not exist, write to db, and return id to callback
      } else {
        client.query("INSERT INTO sessions (key, created_at, data) VALUES ('" + sessionId + "','" + new Date().toISOString() + "','" + dataHash + "') RETURNING id;", function (err, res) {
          if (err) {
            callback && callback(err);
          }
          if (res && res.rows[0].id) {
            callback(res.rows[0].id);
          }
          client.end();
        });
      }
      client.end();
    });
  });
};


exports.create = function (req, callback) {
  var ip_address = getClientIp(req);
  //----- stub for local testing
  var ua = req.headers['user-agent'];
  var geo = geoip.lookup(ip_address);
  var result = {
    ip_address: ip_address,
    user_agent: ua,
    app_version: appVersion(ua)
  };

  if (geo) {
    $.extend(geo, {
      low_range: geo.range[0],
      high_range: geo.range[1],
      latitude: geo.ll[0],
      longitude: geo.ll[1]
    });
    delete geo.range;
    delete geo.ll;

    $.extend(result, geo);
  }

  query(result, req.sessionID, function (response) {
    callback(response);
  });
};