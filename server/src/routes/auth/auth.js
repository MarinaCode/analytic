var express = require('express');
var url = require('url');
var router = express.Router();
var User = require('../../model').User;
var jwt    = require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
   },
    function(email, password, done) {
        User.getUserByUsername(email).then(function (data) {
            if (data.error) {
                return done(null, false, {message: 'Unknown User'});
            } else {
                return done(null, data);
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/authenticate', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(400).send({error: "User not found"}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.status(200).send(user);
        });
    })(req, res, next);
});

router.post('/logout', function(req, res) {
    req.logout();
    res.send(200, "ok");

});


module.exports = router;