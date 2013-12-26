var session = require('../../models/session')
  , index = require('../../lib/index');

var sessionData = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1738.0 Safari/537.36'
  },
  connection: {
    remoteAddress: '207.97.227.239'
  },
  sessionID: 'DpuZpKMqi9ZU8r1MKF7DEcxt'
};

describe('session data', function () {
  beforeEach(function(done){
    index.pgQuery("DELETE from sessions;", done);
  });

  afterEach(function(done){
    index.pgQuery("DELETE from sessions;", done);
  });

  it('stores the session', function (done) {
    session.create(sessionData, function (err, res) {
      if (err) { done(err) }
      index.pgQuery("SELECT * FROM sessions LIMIT 1;", function (err, res) {
        if (err) { done(err) }
        expect(res).toBeTruthy();
        var response = res.rows[0];
        expect(response.key).toEqual('DpuZpKMqi9ZU8r1MKF7DEcxt')
        expect(index.parse(response.data)).toEqual({
          city: 'San Antonio',
          region: 'TX',
          country: 'US',
          latitude: '29.4889',
          longitude: '-98.3987',
          low_range: '3479297920',
          high_range: '3479304169',
          ip_address: '207.97.227.239',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1738.0 Safari/537.36',
          app_version: 'desktop'
        });
        done();
      });
    });
  });

  it('does not duplicate the session', function (done) {
    index.pgQuery("select count(*) from sessions;", function(err, res) {
      if (err) { done(err) }
      expect(res.rows[0].count).toEqual('0');
      session.create(sessionData, function(err, res){
        if (err) { done(err) }
        index.pgQuery("select count(*) from sessions;", function(err, res){
          if (err) { done(err) }
          expect(res.rows[0].count).toEqual('1');
          session.create(sessionData, function(err, res) {
            if (err) { done(err) }
            index.pgQuery("select count(*) from sessions;", function(err, res) {
              if (err) { done(err) }
              expect(res.rows[0].count).toEqual('1');
              done();
            });
          });
        });
      });
    });
  });
});