var adminLib = require("./lib/admin");

//this function lists all the feeds
exports.listAllFeeds = function (req, res) {
    var max = 10;
    if (req.query.max) {
        max = req.query.max - 1;
    }
    adminLib.listAllFeeds(max, function (err, result) {
        if (!err) {
            sendSuccessResponse(res, result);
        }
        else {
            sendErrorResponse(res, {error: err});
        }
    });
}

exports.createFeed = function (req, res) {
    var feed = req.query.feed;
    if (!feed) {
        sendErrorResponse(res, {error: "Specify the feed message"});
    }
    else {
        adminLib.createFeed(feed, function (err) {
            if (!err) {
                sendSuccessResponse(res, {message: "Feed stored successfully"});
            }
            else {
                sendErrorResponse(res, {error: err});
            }
        });
    }
}
//Function to remove the induvidual feed
exports.removeFeed = function (req, res) {
    var feedID = req.query.id;
    if (!feedID) {
        sendErrorResponse(res, {error: "Specify the feed id"});
    }
    else {
        adminLib.removeFeed(feedID, function (err) {
            if (!err) {
                sendSuccessResponse(res, {message: "Feed removed successfully"});
            }
            else {
                sendErrorResponse(res, {error: err});
            }
        });
    }
}

function sendErrorResponse(res, result) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(result));
    res.end();
}

function sendSuccessResponse(res, result) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(result));
    res.end();
}