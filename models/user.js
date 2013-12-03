DNAlibs = require('./index');
var pg = DNAlibs.pg
  , hstore = DNAlibs.hstore
  , conString = DNAlibs.conString
  , $ = DNAlibs.$
  , request = require('request')
  , Like = require('./like');


var pgQuery = function (query, success, fail) {
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
        if (fail) {
          return failure
        }
        if (success && !!(success.rows[0] && success.rows[0].id)) {
          self.facebook_data(data, success.rows[0].id);
          callback(success.rows[0].id);
        } else {
          pgQuery("INSERT into users (client_id, access_token, source_id) VALUES ('" + data.uid + "','" + data.uat + "','" + data.suid + "') RETURNING id;", function (successInsert, failInsert) {
            if (failInsert) {
              return failure
            }
            var userId = successInsert.rows[0].id;
            if (successInsert && userId) {
              if (data.uat && data.suid) {
                self.facebook_data(data, userId);
              }
              callback(userId);
            }
          })
        }
      });
    }
  },

  facebook_data: function (data, user_id) {
    Like.create(data, user_id);

    var self = this;
    //user demographics
    request('https://graph.facebook.com/fql?q=select+name,sex,birthday_date,hometown_location,current_location,friend_count,education,work+from+user+where+uid=' + data.suid + '&access_token=' + data.uat, function (err, res, body) {
      var demographics = JSON.parse(body);
      var education = {};
      var work = {};

      $.each(demographics.data, function (rowNumber, dataHash) {
        //Education
        $.each(dataHash.education, function (rowNumber, result) {
          education[result.type.toLowerCase().replace(' ', '_')] = {
            'name': result.school.name,
            'year': result.year.name,
            'page_id': result.school.id
          };
        });
        //Work
        if (dataHash.work) {
          $.each(dataHash.work, function (rownumber, result) {
            work["employer"] = {
              'name': result.employer && result.employer.name,
              'location': result.location && result.location.name,
              'position': result.position && result.position.name,
              'page_id': result.employer && result.employer.id
            };
          });
        }
      });

      self.education(education, user_id);
      self.work(work, user_id);

      var details = demographics.data[0];
      var location = hstore.stringify(details.current_location)
//      pgQuery("UPDATE users SET location = hstore('" + location + "') WHERE id=" + user_id + ";");
      console.info("UPDATE users SET location= hstore('" + location + "'), birthdate=" + details.birthday_date + ", gender='" + details.sex + "', source='facebook' " +
        "WHERE id=" + user_id + ";")

      pgQuery("UPDATE users SET location= hstore('" + location + "'), birthdate=" + details.birthday_date + ", gender='" + details.sex + "', source='facebook' " +
        "WHERE id=" + user_id + ";");
    });
  },

  education: function (data, user_id) {
    $.each(data, function (id, value) {
      pgQuery("SELECT id from education where user_id=" + user_id + " AND page_id=" + value.page_id + ";", function (res, err) {
        if (err) {
          return console.error("issue querying user and page_id - education", err)
        }
        if (res && !!(res.rows[0] && res.rows[0].id)) {
          return true;
        } else {
          pgQuery("INSERT into education (user_id, type, page_id, name, year) " +
            "VALUES (" + user_id + ",'" + id + "'," + value.page_id + ",'" + value.name + "'," + parseInt(value.year) + ")");
        }
      });
    })
  },

  work: function (data, user_id) {
    $.each(data, function (id, value) {
      pgQuery("SELECT id from work where user_id=" + user_id + " AND page_id=" + value.page_id + ";", function (res, err) {
        if (err) {
          return console.error("issue querying user and page_id - work", err)
        }
        if (res && !!(res.rows[0] && res.rows[0].id)) {
          return true;
        } else {
          pgQuery("INSERT into work (user_id, location, position, page_id, company) " +
            "VALUES (" + user_id + ",'" + value.location + "','" + value.position + "'," + value.page_id + ",'" + value.name + "')");
        }
      });
    })
  }
};




























