DNAlibs = require('./index');
var pg = DNAlibs.pg
  , hstore = DNAlibs.hstore
  , conString = DNAlibs.conString
  , $ = DNAlibs.$
  , request = require('request')
  , Like = require('./like');


var pgQuery = function (query, success, fail) {
  console.info('QUERY REQ', query)
  pg.connect(conString, function (err, client, done) {
    if (err) {
      fail && fail(err);
      return console.error('could not connect to database', err)
    }
    client.query(query, function (err, result) {
      done();
      if (err) {
        fail && fail(err);
        return console.error('could not connect to database', err)
      }
      if (result) {
        success && success(result);
      }
    });
  });
};

exports.user = {
  create: function (data, callback) {
    var failure = function (result) {
      return console.error("a failure occurred", result);
    };
    var self = this;
    if (data.uid) {
      pgQuery("SELECT id from users where client_id='" + data.uid + "';", function (success, fail) {
        if (fail) { return failure }
        if (success && !!(success.rows[0] && success.rows[0].id)) {
          self.facebook_data(data, success.rows[0].id);
          callback(success.rows[0].id);
        } else {
          pgQuery("INSERT into users (client_id, access_token, facebook_id) VALUES ('" + data.uid + "','" + data.uat + "','" + data.fb_uid + "') RETURNING id;", function (successInsert, failInsert) {
            if (failInsert) { return failure }
            var userId = successInsert.rows[0].id;
            if (successInsert && userId) {
              if (data.uat && data.fb_uid) {
                self.facebook_data(data, userId);
              }
              callback(userId);
            }
          })
        }
      });
    }
  },

  facebook_data: function (fb_data, user_id) {
    Like.create(fb_data, user_id);

//    //user demographics
//    request('https://graph.facebook.com/fql?q=select+name,sex,birthday_date,hometown_location,current_location,friend_count,education,work+from+user+where+uid=' + fb_data.fb_uid + '&access_token=' + fb_data.uat, function (err, res, body) {
//      var demographics = JSON.parse(body);
//      var education = {};
//      var work = {};
//      var hometown = {};
//      var details = {};
//
//      details = demographics.data[0];
//
//      $.each(demographics.data, function (rowNumber, data) {
//        //Education
//        $.each(data.education, function (rowNumber, result) {
//          education[result.type.toLowerCase().replace(' ', '_')] = {
//           'name' : result.school.name,
//           'year' : result.year.name,
//           'page_id': result.school.id
//          };
//        });
//        //Work
//        if (data.work) {
//          $.each(data.work, function (rownumber, result) {
//            work["employer"] = {
//              'name': result.employer && result.employer.name,
//              'location' : result.location && result.location.name,
//              'position' : result.position && result.position.name,
//              'page_id' : result.employer && result.employer.id
//            };
//          });
//        }
////        //Hometown
////        if (data.hometown_location) {
////          hometown = data.hometown_location
////        }
////
////        console.info('home', hometown)
////
//        delete details.education;
//        delete details.work;
////        delete demographics.data[0].hometown;
////
//        $.extend(details, {'education': education}, {'work': work});
////        console.info('demo after', demographics)
//      });
//
//
//      console.info('details', details)
//
//      pgQuery("INSERT into users (data) VALUES ('" + details + "');");

//    });
  }
};