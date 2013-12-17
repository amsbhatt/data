var interaction = require('../../models/interaction')
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

var deleteInt = pgQuery("delete from interactions;");

var interactionData = {method: 'POST', headers: {referer: 'http://localhost:3001/'}, body: {
  category: 'button',
  object: 'hello',
  action: 'click',
  data: { direction: 'left',
    dnaInteraction: 'BLC',
    dnaGroup: 'In Theaters',
    dnaTarget: '264' },
  media_id: '123',
  created_at: new Date().toISOString(),
  userInfo: { uid: '', suid: '', uat: '' }}};

describe('interaction data', function () {
  it('with no user', function (done) {
    interaction.create(123, interactionData);
    pgQuery("select * from interactions ORDER BY created_at DESC LIMIT 1;", function (err, res) {
      var response = res.rows[0];
      expect(response).toBeTruthy();
      expect(err).toBeFalsy();
      expect(response.category).toEqual('button');
      expect(response.object).toEqual('hello');
      expect(response.action).toEqual('click');
      expect(response.media_id).toEqual(123);
      expect(response.created_at).toBeTruthy();
      expect(response.userInfo).toEqual();
      expect(response.user_id).toBeNull();
      expect(response.session_id).toBeTruthy();
      expect(hstore.parse(response.data)).toEqual({
        tracking_id: 'UL',
        interaction: 'BLC',
        direction: 'left',
        target: '264',
        group: 'In Theaters',
        url: 'http://localhost:3001/'
      });
      done();
    });
  });

  describe('with no user', function () {
    it('invalid category', function (done) {
      interaction.create(456, $.extend(interactionData.body, { category: 'yourFace'}));
      pgQuery("select category from interactions where category='yourFace';", function (err, res) {
        expect(res.rows[0]).toBeFalsy();
        expect(err).toBeFalsy();
        done();
      });
    });

    it('invalid action', function (done) {
      interaction.create(678, $.extend(interactionData.body, { action: 'goober'}));
      pgQuery("select action from interactions where action='goober';", function (err, res) {
        expect(res.rows[0]).toBeFalsy();
        expect(err).toBeFalsy();
        done();
      });
    })
  });
});