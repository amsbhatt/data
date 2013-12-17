DNAlibs = require('./index');
var pg = DNAlibs.pg
  , hstore = DNAlibs.hstore
  , conString = DNAlibs.conString
  , $ = DNAlibs.$
  , request = require('request')
  , Like = require('./like');


var pgQuery = function (query, callback) {
  pg.connect(conString, function (err, client) {
    if (err) {
      callback && callback(err);
    }
    client.query(query, function (err, result) {
      callback && callback(err, result);
      client.end();
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
      pgQuery("SELECT id from users where client_id='" + data.uid + "';", function (err, res) {
        if (err) {
          return failure
        }
        if (res && !!(res.rows[0] && res.rows[0].id)) {
          self.facebook_data(data, res.rows[0].id);
          callback(res.rows[0].id);
        } else {
          pgQuery("INSERT into users (client_id, access_token, source_id) VALUES ('" + data.uid + "','" + data.uat + "','" + data.suid + "') RETURNING id;", function (err, res) {
            if (err) {
              return failure
            }
            var userId = res.rows[0].id;
            if (res && userId) {
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
      if (!err && res.statusCode == 200) {
        var demographics = JSON.parse(body);

        $.each(demographics.data, function (rowNumber, dataHash) {
          //If education is present, add to education table
          if (dataHash.education) {
            self.education(dataHash.education, user_id);
          }
          //If work is present, add to work table
          if (dataHash.work) {
            self.work(dataHash.work, user_id);
          }
        });

        //Update user row with demographics data
        self.demographics(demographics.data[0], user_id);
      }
    });
  },

  demographics: function (data, user_id) {
    var currentLocation = data.current_location ? hstore.stringify(data.current_location) : '';
    var hometownLocation = data.hometown_location ? hstore.stringify(data.hometown_location) : '';
    var birthday = data.birthday_date ? new Date(data.birthday_date) : null;
    var formattedBirthday = birthday ? birthday.getFullYear() + '-' + (birthday.getMonth() + 1) + '-' + birthday.getDate() : ''

    pgQuery("SELECT current_location ->'id' as id from users where id=" + user_id, function (err, res) {
      if (err) {
        return console.error("issue querying user and current location - user", err)
      }
      //if current_location page_id matches then don't update information
      if ((res && !!(res.rows[0] && res.rows[0].id) &&  data.current_location && res.rows[0].id == data.current_location.id )) {
        return true;
      } else {
        pgQuery("UPDATE users SET hometown_location= hstore('" + hometownLocation + "'), " +
          "current_location= hstore('" + currentLocation + "'), " +
          "gender='" + data.sex + "', source='facebook' " +
          "WHERE id=" + user_id + ";", function (err, res) {
          if (err) {
            console.info('error with demographics', err)
          }
        });
        if (birthday) {
          pgQuery("UPDATE users SET birthdate=(to_date('" + formattedBirthday + "', 'YYYY-MM-DD')), WHERE id=" + user_id + ";", function (err, res) {
            if (err) {
              console.info('error with birthday', err)
            }
          });
        }
      }
    });
  },

  education: function (data, user_id) {
    var education = {};
    //Education
    $.each(data, function (rowNumber, result) {
      education[result.type.toLowerCase().replace(' ', '_')] = {
        'name': result.school.name,
        'year': result.year.name,
        'page_id': result.school.id
      };
    });

    $.each(education, function (id, value) {
      pgQuery("SELECT id from education where user_id=" + user_id + " AND page_id=" + value.page_id + ";", function (err, res) {
        if (err) {
          return console.error("issue querying user and page_id - education", err)
        }
        if (res && !!(res.rows[0] && res.rows[0].id)) {
          return true;
        } else {
          pgQuery("INSERT into education (user_id, type, page_id, name, year, created_at) " +
            "VALUES (" + user_id + ",'" + id + "'," + value.page_id + ",'" + value.name + "'," + parseInt(value.year) + ",'" + new Date().toISOString() + "');");
        }
      });
    })
  },

  work: function (data, user_id) {
    var work = {};

    //Work
    $.each(data, function (rownumber, result) {
      work["employer"] = {
        'name': result.employer && result.employer.name,
        'location': result.location && result.location.name,
        'position': result.position && result.position.name,
        'page_id': result.employer && result.employer.id
      };
    });

    $.each(work, function (id, value) {
      pgQuery("SELECT id from work where user_id=" + user_id + " AND page_id=" + value.page_id + ";", function (err, res) {
        if (err) {
          return console.error("issue querying user and page_id - work", err)
        }
        if (res && !!(res.rows[0] && res.rows[0].id)) {
          return true;
        } else {
          pgQuery("INSERT into work (user_id, location, position, page_id, company, created_at) " +
            "VALUES (" + user_id + ",'" + value.location + "','" + value.position + "'," + value.page_id + ",'" + value.name + "','" + new Date().toISOString() + "');");
        }
      });
    })
  }
};