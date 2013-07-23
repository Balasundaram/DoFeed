/*
 * GET home page.
 */
var admin = require("../routers/admin");
exports.init = function (app) {
    app.get("/api/feed/list", admin.listAllFeeds);
    app.all("/api/create/feed", admin.createFeed);
    app.all("/api/feed", admin.getFeed);
    app.all("/api/delete/feed", admin.removeFeed);
};