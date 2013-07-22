var adminLib = require("./lib/admin");

//this function lists all the feeds
exports.listAllFeeds = function (req, res) {
    var max = 10;
    if (req.query.max) {
        max = req.query.max - 1;
    }
    adminLib.listAllFeeds(max, function (err, result) {
        if (!err) {
            writeResponse(res, 200, result);
        }
        else {
            writeResponse(res, 400, {error: err});
        }
    });
}

exports.createFeed = function (req, res) {
    var feed = req.query.feed;
    if (feed == null) {
        writeResponse(res, 404, {error: "Specify the feed message"});
    }
    else {
        adminLib.createFeed(feed, function (err) {
            if (!err) {
                writeResponse(res, 200, {message: "Feed stored successfully"});
            }
        });
    }
}

exports.index = function (req, res) {
    res.render("testinput");
}

function writeResponse(res, status, result) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(result));
    res.end();
}