var user = require('../../models/user')
  , lib = require('../../lib/index')
  , request = require('request')
  , $ = require('jquery');

describe('user data', function () {
  beforeEach(function (done) {
    lib.pgQuery("delete from users;", done);
  });

  afterEach(function (done) {
    lib.pgQuery("delete from users;", done);
    lib.pgQuery("delete from work;", done);
    lib.pgQuery("delete from education;", done);
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

  describe('facebook data', function () {
    //THIS IS WITH USER DATA FROM AMI'S FACEBOOK ACCOUNT
    var userData = {
      uid: 444,
      suid: '100002407031588',
      uat: 'CAACEdEose0cBAHRkwNN64ExaA1OTZCgZAZCRGZBcT3MHndvVnVEZAwZAxILHvylEhy7o2NXtsqJ0TAEz8HDM6FamZBZArnWFQSSZAVKLtM3yazsFsKws9iLvakN7LGGHZCY3hsiwNuuPRi3NQQXGiQWBY6pBZCZCnSFoioE5FYK35eS522U8JbFovwhAZCgZAtQ6GtHcaXSFimwIc9MwZDZD'
    };

    it('makes the facebook request', function (done) {
      user.create(userData, function (err, resId) {
        if (err) {
          done(err)
        }
        request('https://graph.facebook.com/fql?q=select+name,sex,birthday,hometown_location,current_location,friend_count,education,work+from+user+where+uid=' + userData.suid + '&access_token=' + userData.uat, function (err, res, body) {
          expect(body).toBeTruthy();
          setTimeout(function () {
            //TEST FOR DEMOGRAPHICS
            lib.pgQuery("SELECT * from users where id=" + resId + ";", function (err, res) {
              if (err) {
                done(err)
              }
              var response = res.rows[0];
              expect(response.client_id).toEqual(userData.uid.toString());
              expect(response.source_id).toEqual(userData.suid);
              expect(response.access_token).toEqual(userData.uat);
              expect(response.gender).toEqual('female');
              expect(response.source).toEqual('facebook');
//              expect(response.created_at).toBeTruthy();
              expect(lib.parse(response.current_location)).toEqual({
                id: '107981152555999',
                zip: '',
                city: 'Pleasanton',
                name: 'Pleasanton, California',
                state: 'California',
                country: 'United States',
                latitude: '37.6725',
                longitude: '-121.883'
              });
              expect(lib.parse(response.hometown_location)).toEqual({
                id: '103177143056458',
                zip: '',
                city: 'Rodeo',
                name: 'Rodeo, California',
                state: 'California',
                country: 'United States',
                latitude: '38.0313',
                longitude: '-122.262'
              });
              //TEST FOR WORK
              lib.pgQuery("SELECT * from work where user_id=" + resId + ";", function (err, res) {
                if (err) {
                  done(err)
                }
                var response = res.rows[0];
                expect(response.user_id).toEqual(resId);
                expect(response.location).toEqual('Pleasanton, California');
                expect(response.position).toEqual('Software Developer');
                expect(response.page_id).toEqual('132244330147214');
                expect(response.company).toEqual('Milyoni');
                expect(response.created_at).toBeTruthy();

                //TEST FOR EDUCATION
                lib.pgQuery("SELECT * from education where user_id=" + resId + ";", function (err, res) {
                  if (err) {
                    done(err)
                  }
                  var college, hs;
                  if (res.rows[0].type == 'college') {
                    college = res.rows[0];
                    hs = res.rows[1];
                  } else {
                    college = res.rows[1];
                    hs = res.rows[0];
                  }
                  expect(college.user_id).toEqual(resId);
                  expect(college.type).toEqual('college');
                  expect(college.year).toEqual(2007);
                  expect(college.page_id).toEqual('112199395458691');
                  expect(college.name).toEqual('University of California, Davis');
                  expect(college.created_at).toBeTruthy();
                  expect(hs.user_id).toEqual(resId);
                  expect(hs.type).toEqual('high_school');
                  expect(hs.year).toEqual(2004);
                  expect(hs.page_id).toEqual('112390175438768');
                  expect(hs.name).toEqual('James Logan High School');
                  expect(hs.created_at).toBeTruthy();
                  //TEST FOR LIKES
                  lib.pgQuery("SELECT * FROM likes where user_id="+ resId +";", function(err, res){
                    if (err) {
                      done(err)
                    }
                    var like;
                    $.each(res.rows, function(index, value){
                      if (value.page_id == '102872896493889') {
                        like = value;
                      }
                    });
                    expect(like.user_id).toEqual(resId);
                    expect(like.category).toEqual('movie');
                    expect(like.page_id).toEqual('102872896493889');
                    expect(like.created_at).toBeTruthy();
                    done();
                  });
                });
              });
            });
          }, 1000);
        });
      });
    });
  });
});