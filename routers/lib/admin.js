var redis = require('redis');

var redis_conn = redis.createClient();

exports.listAllFeeds = function (max, cb) {
    var feedList = [], done = 0, self = this;
    redis_conn.lrange("index:feeds:list", 0, max, function (err, res) {
        if (res.length > 0) {
            res.forEach(function (v) {
                self.getFeed(v, function (err, feed) {
                    if (!err) {
                        feedList.push({id: v, feed: feed});//JSON.parse(feed);
                        done++;
                    }
                    if (done === res.length) {
                        cb(null, feedList);
                    }
                });
            });
        }
        else {
            cb("Feed List is empty", null);
        }
    });

}

exports.getFeed = function (id, cb) {
    redis_conn.get(id, function (err, res) {
        if (err) {
            cb(err, null);
        }
        else {
            cb(null, res);
        }
    });

}

exports.createFeed = function (feed, cb) {
    var feedID = "feed-" + _getUniqueId(new Date());
    var multi = redis_conn.multi();
    multi.set(feedID, feed);
    multi.lpush("index:feeds:list", feedID);
    multi.exec(function (err, res) {
        if (err) {
            cb(err);
        }
        else {
            cb(null);
        }
    });

}

_getUniqueId = function getUniqueId(date) {
    var date = date || new Date();

    function pad(num, numZeros) {
        var n = Math.abs(num);
        var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
        var zeroString = Math.pow(10, zeros).toString().substr(1);
        if (num < 0) {
            zeroString = '-' + zeroString;
        }
        return zeroString + n;
    }

    var timeComponents = [date.getFullYear(), pad(date.getMonth(), 2), pad(date.getDate(), 2), pad(date.getHours(), 2),
        pad(date.getMinutes(), 2), pad(date.getSeconds(), 2)];
    return timeComponents.join("");
}
