var lib = require('../lib/index')
  , $ = require('jquery')
  , hstore = require('pg-hstore')
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

  lib.pgQuery("SELECT id from sessions where key='" + req.sessionID + "';", function (err, res) {
    if (err) {
      return callback && callback(err, res);
    }
    if (res && !!(res.rows[0] && res.rows[0].id)) {
      callback && callback(err, res.rows[0].id);
    } else {
      lib.pgQuery("INSERT INTO sessions (key, created_at, data) VALUES ('" + req.sessionID + "','" + new Date().toISOString() + "','" + hstore.stringify(result) + "') RETURNING id;", function (err, res) {
        if (err) {
          return callback && callback(err, res);
        }
        if (res && res.rows[0].id) {
          callback && callback(err, res.rows[0].id);
        }
      });
    }
  });
};