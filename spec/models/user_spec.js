var user = require('../../models/user')
  , lib = require('../../lib/index');

describe('user data', function () {
  beforeEach(function (done) {
    lib.pgQuery("delete from users;", done);
  });

  afterEach(function (done) {
    lib.pgQuery("delete from users;", done);
  });

  describe('no existing user', function () {
    it('valid params', function (done) {
      var userData = {
        uid: 456,
        suid: '234567',
        uat: 'CATSANDBOOTS1234455'
      };

      user.create(userData, function (err, res) {
        if (err) {
          done(err)
        }
        lib.pgQuery("SELECT * FROM users LIMIT 1;", function (err, res) {
          if (err) {
            done(err)
          }
          expect(res).toBeTruthy();
          var response = res.rows[0];
          expect(response.client_id).toEqual('456');
          expect(response.source_id).toEqual('234567');
          expect(response.access_token).toEqual('CATSANDBOOTS1234455');
          expect(response.current_location).toEqual(null);
          expect(response.hometown_location).toEqual(null);
          expect(response.gender).toEqual(null);
          expect(response.birthdate).toEqual(null);
          done();
        });
      });
    });

    it('invalid params | no source', function (done) {
      var userData = {
        uid: 878,
        suid: '',
        uat: 'YOURFACE123'
      };

      user.create(userData, function (err, res) {
        if (err) {
          done(err)
        }
        lib.pgQuery("SELECT * FROM users LIMIT 1;", function (err, res) {
          if (err) {
            done(err)
          }
          expect(res).toBeTruthy();
          var response = res.rows[0];
          expect(response.client_id).toEqual('878');
          expect(response.source_id).toEqual('');
          expect(response.access_token).toEqual('YOURFACE123');
          expect(response.current_location).toEqual(null);
          expect(response.hometown_location).toEqual(null);
          expect(response.gender).toEqual(null);
          expect(response.birthdate).toEqual(null);
          done();
        });
      });
    });
  });

  describe('existing user', function () {
    var userData = {
      uid: 878,
      suid: '100002407031588',
      uat: 'CAACEdEose0cBAI3gi4boK29SOTfT4hfiN45ZAiDZAIgCdPP8BV8GmEbeGNyNUSpSDF8jOsI3CoU99SZA0Uv63PN9MdwN9Ep6yiLVV82h0IO9sMBwwqtjNmlGZCR4ZAkW3aKOqpehshlTIDOalfCFa0NYqqFGkZCMoqKXHuNA06CdwiuyHYnU1fuRfGZARywd8wZD'
    };

    beforeEach(function (done) {
      user.create(userData, function (err, res) {
        if (err) {
          done(err)
        }
        lib.pgQuery("SELECT count(*) FROM users;", function (err, res) {
          if (err) {
            done(err)
          }
          expect(res.rows[0].count).toEqual('1');
        });
        done();
      });
    });

    it('finds the user', function (done) {
      user.create(userData, function (err, res) {
        if (err) {
          done(err)
        }
        lib.pgQuery("SELECT count(*) FROM users;", function (err, res) {
          if (err) {
            done(err)
          }
          expect(res.rows[0].count).toEqual('1');
          done();
        });
      });
    })
  });

  //USE NOCK FOR MOCKING REQUESTS
//  describe('facebook data', function () {
//    var userData = {
//      uid: 444,
//      suid: '100002407031588',
//      uat: 'CAACEdEose0cBAI3gi4boK29SOTfT4hfiN45ZAiDZAIgCdPP8BV8GmEbeGNyNUSpSDF8jOsI3CoU99SZA0Uv63PN9MdwN9Ep6yiLVV82h0IO9sMBwwqtjNmlGZCR4ZAkW3aKOqpehshlTIDOalfCFa0NYqqFGkZCMoqKXHuNA06CdwiuyHYnU1fuRfGZARywd8wZD'
//    };
//
//    it('makes the facebook request', function (done) {
//      user.create(userData, function(err, res){
//        if(err) {done(err)}
//        spyOn(user, 'facebook_data');
//        expect(user.facebook_data).toHaveBeenCalled();
//      });
//    });
//  });
});