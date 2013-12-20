var lib = require('../lib/index')
  , $ = require('jquery')
  , request = require('request')
  , hstore = require('pg-hstore')
  , Like = require('./like');

var facebook_data = function (data, user_id) {
  Like.create(data, user_id);

  var self = this;
  //user demographics
  request('https://graph.facebook.com/fql?q=select+name,sex,birthday,hometown_location,current_location,friend_count,education,work+from+user+where+uid=' + data.suid + '&access_token=' + data.uat, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      var demographics = JSON.parse(body);

      $.each(demographics.data, function (rowNumber, dataHash) {
//          //If education is present, add to education table
        if (dataHash.education) {
          educationCall(dataHash.education, user_id);
        }
//          //If work is present, add to work table
        if (dataHash.work) {
          workCall(dataHash.work, user_id);
        }
      });

      //Update user row with demographics data
      demographicsCall(demographics.data[0], user_id);
    }
  });
};

var demographicsCall = function (data, user_id) {
  var currentLocation = data.current_location ? hstore.stringify(data.current_location) : '';
  var hometownLocation = data.hometown_location ? hstore.stringify(data.hometown_location) : '';
  var birthday = data.birthday ? new Date(data.birthday) : null;
  var formattedBirthday = birthday ? birthday.getFullYear() + '-' + (birthday.getMonth() + 1) + '-' + birthday.getDate() : '';

  lib.pgQuery("SELECT current_location ->'id' as id from users where id=" + user_id, function (err, res) {
    if (err) {
      return console.error("issue querying user and current location - user", err)
    }
    //if current_location page_id matches then don't update information
    if ((res && !!(res.rows[0] && res.rows[0].id) && res.rows[0].id == data.current_location.id )) {
      return true;
    } else {
      lib.pgQuery("UPDATE users SET hometown_location= hstore('" + hometownLocation + "'), " +
        "current_location= hstore('" + currentLocation + "'), " +
        "gender='" + data.sex + "', source='facebook' " +
        "WHERE id=" + user_id + ";", function (err, res) {
        if (err) {
          console.info('error with demographics', err)
        }
      });
      if (birthday) {
        lib.pgQuery("UPDATE users SET birthdate=(to_date('" + formattedBirthday + "', 'YYYY-MM-DD')) WHERE id=" + user_id + ";", function (err, res) {
          if (err) {
            console.info('error with birthday', err)
          }
        });
      }
    }
  });
};

var educationCall = function (data, user_id) {
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
    lib.pgQuery("SELECT id from education where user_id=" + user_id + " AND page_id=" + value.page_id + ";", function (err, res) {
      if (err) {
        return console.error("issue querying user and page_id - education", err)
      }
      if (res && !!(res.rows[0] && res.rows[0].id)) {
        return true;
      } else {
        lib.pgQuery("INSERT into education (user_id, type, page_id, name, year, created_at) " +
          "VALUES (" + user_id + ",'" + id + "'," + value.page_id + ",'" + value.name + "'," + parseInt(value.year) + ",'" + new Date().toISOString() + "');");
      }
    });
  })
};

var workCall = function (data, user_id) {
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
    lib.pgQuery("SELECT id from work where user_id=" + user_id + " AND page_id=" + value.page_id + ";", function (err, res) {
      if (err) {
        return console.error("issue querying user and page_id - work", err)
      }
      if (res && !!(res.rows[0] && res.rows[0].id)) {
        return true;
      } else {
        lib.pgQuery("INSERT into work (user_id, location, position, page_id, company, created_at) " +
          "VALUES (" + user_id + ",'" + value.location + "','" + value.position + "'," + value.page_id + ",'" + value.name + "','" + new Date().toISOString() + "');");
      }
    });
  })
}

exports.create = function (data, callback) {
  var dataArray = [];
  $.each(data, function(key, value){
    dataArray.push(value);
  });
  lib.pgQuery("SELECT id, source_id from users where client_id='" + data.uid + "';", function (err, res) {
    if (err) {
      return callback && callback(err, res);
    }
    if (res && !!(res.rows[0] && res.rows[0].id)) {
      if (res.rows[0].source_id) {
        facebook_data(data, res.rows[0].id);
      }
      callback && callback(err, res.rows[0].id);
    } else {
      lib.pgQuery("INSERT into users (client_id, source_id, access_token) VALUES ($1, $2, $3) RETURNING id", dataArray, function (err, res) {
        if (err) {
          return callback && callback(err, res);
        }
        if (res && res.rows[0] && res.rows[0].id) {
          if (data.uat && data.suid) {
            facebook_data(data, res.rows[0].id);
          }
          callback && callback(err, res.rows[0].id);
        }
      })
    }
  });
};