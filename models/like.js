var lib = require('../lib/index')
  , $ = require('jquery')
  , request = require('request');

exports.create = function (data, user_id, callback) {
  request('https://graph.facebook.com/fql?q=select+page_id,type+from+page_fan+where+uid=' + data.suid + '&access_token=' + data.uat, function (err, res, body) {
    if (err) {
      return callback && callback(err, res)
    }
    if (!err && res.statusCode == 200) {
      var likes = JSON.parse(body);

      $.each(likes.data, function (rowNumber, likeData) {
        //Check to see if user_id and page_id already exist in likes table
        lib.pgQuery("SELECT id FROM likes WHERE user_id=" + user_id + " AND page_id=" + likeData.page_id + ";", function (err, res) {
          if (err) {
            return callback && callback(err, res)
          }
          if (res && !!(res.rows[0] && res.rows[0].id)) {
            callback && callback(err, res)
          } else {
            //Create a new entry since no matching records were found
            lib.pgQuery("INSERT into likes (category, page_id, user_id, created_at) VALUES ('" + likeData.type.toLowerCase().replace(' ', '_') + "'," + parseInt(likeData.page_id) + "," + parseInt(user_id) + ",'" + new Date().toISOString() + "');", function (err, res) {
              if (err) {
                return callback && callback(err, res)
              }
              callback && callback(err, res)
            });
          }
        });
      });
    }
  });
};