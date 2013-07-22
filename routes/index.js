/*
 * GET home page.
 */
var admin = require("../routers/admin");
exports.init = function (app) {
    app.get("/", admin.index);
    app.get("/feed/list",admin.listAllFeeds);
    app.all("/create/feed",admin.createFeed);
};