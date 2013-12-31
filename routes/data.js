var fs = require('fs')
  , lib = require('../lib/index')
  , $ = require('jquery');

var sessionsAgg = function (callback) {
  lib.pgQuery("SELECT count(DISTINCT key) from sessions;", function (err, res) {
    if (err) {
      callback && callback(err)
    } else {
      callback && callback(res.rows[0].count);
    }
  });
};

var usersAgg = function (callback) {
  lib.pgQuery("SELECT count(*) from users;", function (err, res) {
    if (err) {
      callback && callback(err)
    } else {
      callback && callback(res.rows[0].count);
    }
  });
};

var now = new Date();
var weekAgo = new Date(new Date().setDate(new Date().getDate() - 7));

var formatDate = function (date) {
  var month = date.getUTCMonth() + 1
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();
  return (year + '-' + month + '-' + day);
};

var likes = function (callback) {
  var total_likes = 0
    , total_day_likes = 0
    , total_week_likes = 0;
  lib.pgQuery("select category, count(*) from likes group by category;", function (err, res) {
    if (err) {
      callback && callback(err)
    } else {
      $.each(res.rows, function (i, v) {
        total_likes += parseInt(v.count);
      });
      lib.pgQuery("select category, count(*) from likes where created_at::date=now()::date group by category order by category;", function (err, resDay) {
        if (err) {
          callback && callback(err)
        } else {
          $.each(resDay.rows, function (i, v) {
            total_day_likes += parseInt(v.count);
          });
          lib.pgQuery("select category, count(*) from likes where created_at::date >= ((now()::date) - '7 days'::INTERVAL) group by category order by category;", function (err, resWeek) {
            if (err) {
              callback && callback(err)
            } else {
              $.each(resWeek.rows, function (i, v) {
                total_week_likes += parseInt(v.count);
              });
            }

            callback && callback({
              'total_likes': total_likes,
              'daily': resDay.rows,
              'total_day_likes': total_day_likes,
              'weekly': resWeek.rows,
              'total_week_likes': total_week_likes
            });
          });
        }
      });
    }
  });
};

exports.create = function (req, res) {
  sessionsAgg(function (total_sessions) {
    usersAgg(function (total_users) {
      likes(function (total_likes) {
        res.render('data', {
          date: formatDate(now),
          week: formatDate(weekAgo),
          sessions: total_sessions,
          users: total_users,
          sessions_user: (total_sessions / total_users),
          likes: total_likes,
          per_user: (total_likes.total_likes / total_users)
        });
      });
    });
  });
//
//  //IF WE WANT TO WRITE A FILE
////  fs.writeFile("../yourFace.txt", "Hey there Aaaaami!", function(err) {
////    if(err) {
////      console.log(err);
////    } else {
////      console.log("The file was saved!");
////    }
////  });
};