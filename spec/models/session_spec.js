var session = require('../../models/session')
  , DNAlibs = require('../../models/index')
  , pg = DNAlibs.pg
  , hstore = DNAlibs.hstore
  , conString = DNAlibs.conString
  , $ = require('jquery');

var pgQuery = function (query, callback) {
  pg.connect(conString, function (err, client) {
    if (err || !client) {
      callback && callback(err || "No client found");
    } else {
      client.query(query, function (err, result) {
        callback && callback(err, result);
        client.end();
      });
    }
  })
};

var sessionData = {
  headers: {
    'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1738.0 Safari/537.36'
  },
  connection : {
    _remoteAddress :  '127.0.0.1'
  },
  sessionId: 'DpuZpKMqi9ZU8r1MKF7DEcxt'
};

describe('session data', function() {
  it('stores the session', function(done) {
    session.create(sessionData);
    pgQuery("SELECT * FROM sessions LIMIT 1;", function(err, res) {
      expect(res).toBeTruthy();
      done();
    });
  });
});