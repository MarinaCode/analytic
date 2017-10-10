var express = require('express');
var url = require('url');
var router = express.Router();
var Sites = require('../../model').Sites;
var User = require('../../model').User;
var Packages = require('../../model').Packages;
var request = require('request');
var dns = require('dns');
var path = require('path');
var fs = require('fs');

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json(false);
    }
}


router.get("/getPackages", function (req,res) {
    Packages.getPackages().then(function (data) {
        res.send(200, data);
    })
});

module.exports = router;