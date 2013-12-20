var interaction = require('../../models/interaction')
  , $ = require('jquery')
  , lib = require('../../lib/index')
  , user = require('../../models/user');

describe('interaction data', function(){
  beforeEach(function(done) {
    lib.pgQuery("delete from users", done);
    lib.pgQuery("delete from interactions", done);
  });

  afterEach(function(done) {
    lib.pgQuery("delete from users", done);
    lib.pgQuery("delete from interactions", done);
  });

  describe('no user', function () {
    it('with valid data', function (done) {
      var interactionData = {
        headers: {referer: 'http://localhost:3001/'},
        body: {
          category: 'button',
          object: 'hello',
          action: 'click',
          data: { direction: 'left',
            dnaInteraction: 'BLC',
            dnaGroup: 'In Theaters',
            dnaTarget: '264' },
          media_id: '123',
          created_at: new Date().toISOString(),
          userInfo: { uid: '', suid: '', uat: '' }
        }
      };

      interaction.create(123, interactionData, function (err, res){
        if (err) { done(err) }
        lib.pgQuery("select * from interactions ORDER BY created_at DESC LIMIT 1;", function (err, res) {
          if (err) { done(err) }
          var response = res.rows[0];
          expect(response).toBeTruthy();
          expect(response.category).toEqual('button');
          expect(response.object).toEqual('hello');
          expect(response.action).toEqual('click');
          expect(response.media_id).toEqual(123);
          expect(response.created_at).toBeTruthy();
          expect(response.userInfo).toEqual();
          expect(response.user_id).toBeNull();
          expect(response.session_id).toBeTruthy();
          expect(lib.parse(response.data)).toEqual({
            url: 'http://localhost:3001/',
            group: 'In Theaters',
            target: '264',
            direction: 'left',
            interaction: 'BLC',
            tracking_id: null
          });
          done();
        });
      });
    });

    describe('with no user', function () {
      it('invalid category', function (done) {
        var interactionData = {
          headers: {referer: 'http://localhost:3001/'},
          body: {
            category: 'yourFace',
            object: 'hello',
            action: 'click',
            data: { direction: 'left',
              dnaInteraction: 'BLC',
              dnaGroup: 'In Theaters',
              dnaTarget: '264' },
            media_id: '123',
            created_at: new Date().toISOString(),
            userInfo: { uid: '', suid: '', uat: '' }
          }
        };

        interaction.create(456, interactionData, function(err, res){
          expect(err).toEqual('User information does not exist or action and/or category are not valid types - category: yourFace, action: click');
          lib.pgQuery("select category from interactions where category='yourFace';", function (err, res) {
            if (err) { done(err) }
            expect(res.rows[0]).toBeFalsy();
            done();
          });
        });
      });

      it('invalid action', function (done) {
        var interactionData = {
          headers: {referer: 'http://localhost:3001/'},
          body: {
            category: 'button',
            object: 'hello',
            action: 'goober',
            data: { direction: 'left',
              dnaInteraction: 'BLC',
              dnaGroup: 'In Theaters',
              dnaTarget: '264' },
            media_id: '123',
            created_at: new Date().toISOString(),
            userInfo: { uid: '', suid: '', uat: '' }
          }
        };

        interaction.create(456, interactionData, function(err, res){
          expect(err).toEqual('User information does not exist or action and/or category are not valid types - category: button, action: goober');
          lib.pgQuery("select action from interactions where action='goober';", function (err, res) {
            if (err) { done(err) }
            expect(res.rows[0]).toBeFalsy();
            done();
          });
        });
      })
    });
  });

//  describe('with user', function () {
//    var interactionData = {
//      headers: {referer: 'http://localhost:3001/'},
//      body: {
//        category: 'button',
//        object: 'hello',
//        action: 'click',
//        data: { direction: 'left',
//          dnaInteraction: 'BLC',
//          dnaGroup: 'In Theaters',
//          dnaTarget: '264' },
//        media_id: '123',
//        created_at: new Date().toISOString(),
//        userInfo: {uid: 123, suid: '12345', uat: 'CABIT999'}
//      }
//    };
//
//    it("creates a user", function(done) {
//      console.info('in create user')
////      spyOn(user, 'create');
//      interaction.create(893, interactionData, {}, function(err, res) {
//        console.info('in here')
//        if (err) { done(err) }
//        expect(user.create).toHaveBeenCalledWith({uid: 123, suid: '12345', uat: 'CABIT999'}, jasmine.any(Function));
//        done();
//      });
//    });
//  });
});