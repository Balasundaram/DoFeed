var redis = require('redis'),
    redisHelper = require('../helpers/redis');

var redis_conn = redis.createClient();

var feedJSON = {
    id: null,
    status: 0
};

exports.listAllFeeds = function (max, cb) {
    var feedList = [], done = 0, self = this;
    redis_conn.lrange(redisHelper.getFeedList(), 0, max, function (err, res) {
        if (res.length > 0) {
            res.forEach(function (v) {
                self.getFeed(v, function (err, feed) {
                    if (!err) {
                        feedList.push(feed);//JSON.parse(feed);
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
    var feedID = "feed-" + _getUniqueId(new Date()), feedList = redisHelper.getFeedList();
    feedJSON.message = feed;
    feedJSON.id = feedID;
    var multi = redis_conn.multi();
    multi.set(feedID, JSON.stringify(feedJSON));
    multi.lpush(feedList, feedID);
    multi.exec(function (err, res) {
        if (err) {
            cb(err);
        }
        else {
            cb(null);
        }
    });
}

//function to remove the induvidual feed
exports.removeFeed = function (feedID, cb) {
    var multi = redis_conn.multi(),
        feedList = redisHelper.getFeedList();

    multi.del(feedID);
    multi.lrem(feedList, 1, feedID);
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
