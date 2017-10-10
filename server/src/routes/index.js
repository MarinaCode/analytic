var express = require('express');
var config = require('../../config/config');
var _ = require('lodash-node');

var router = express.Router();
var analytics_router = express.Router();

var analytics_apis = [{
    route: '/users',
    url: './user/users.js'

}, {
    route: '/auth',
    url: './auth/auth.js'
}, {
    route: '/sites',
    url: './site/sites.js'
}, {
    route: '/packages',
    url: './package/packages.js'
}];

module.exports = function(app) {
    app.use("", router);
    router.use(config.restApis.users.rest_url(), analytics_router);
    use(analytics_router, analytics_apis);
};

function use(root_router, apis) {
    _.each(apis, function(api) {
        var router = require(api.url);
        root_router.use(api.route, router);
    });
}