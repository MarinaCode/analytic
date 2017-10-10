var express = require('express');
var url = require('url');
var router = express.Router();
var User = require('../../model').User;
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy =  require( 'passport-google-oauth2' ).Strategy;
var config = require('../../../config/config');
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(400).send("You are not authenticated");
    }
}

passport.use(new GoogleStrategy({
        clientID: '1078027737702-r97a8da5arhhtu2qciajf8414agcrhgc.apps.googleusercontent.com',
        clientSecret: 'Gg_YMYqWW-W8I4M8pqQTKmRh',
        callbackURL: config.host + ":" + config.port + "/analytic/api/v1/users/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        var body = {
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            gender: profile.gender,
            picture: {
                data: {
                    url: profile.photos[0].value
                }
            }
        };

        User.saveUser(body, 1).then((user)=> {
            return cb(null, user);
        });
    }
));

passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        session: true
    },
    function(req, email, password, done) {
        User.getUserByUsernamePassword(email, password).then(function (data) {
                return done(null, data);
        }, function(err) {
            return done(null, false, {message: err});
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id).then(user=> {
        done(null, user);
    })
});
var restrictImgType = function(req, file, cb) {
    var ext = path.extname(file.originalname).toLowerCase();
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
};
/* Update User*/
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dest =  path.join( __dirname,'../../../public/images');
        callback(null, dest);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '.png');
    }
});

var upload = multer({ storage: storage, fileFilter: restrictImgType});
router.get('/', function(req, res) {
    User.getAllUsers().then(function (data) {
        res.send(data);
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.get('/getUserById', isLoggedIn, function(req, res) {
    User.getUserById(req.user.id).then(function (data) {
        res.send(200, data);
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.get('/getUserByIdFromAdmin/:id', function(req, res) {
    User.getUserById(req.params.id).then(function (data) {
        res.send(data);
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.get('/getUsers', function(req, res) {
    User.getAllUsers().then(function (data) {
        res.send(data);
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.get('/activateEmail/:id', function(req, res) {
    var activation_code = req.params.id;
    User.activateEmail({activation_code: activation_code}).then(function (data) {
        res.send(data);
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.get('/loginGoogle', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/authenticated', isLoggedIn, function(req, res) {
    res.status(200).send(req.user);
})

router.get('/google/callback', passport.authenticate('google'), function(req, res) {
        // Successful authentication, redirect home.
        res.send("Pending...");
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

router.post("/createDemoUser", function(req, res) {
    var idAddress = req.connection.remoteAddress;
    User.createDemoUser(idAddress).then(function (data) {
        req.login(data.result, function(err) {
            if (err) { return next(err); }
            req.session.save(() => {
                return res.status(200).send(data.result);
            })
        });
    }, (err)=> {
        res.status(403).send(err);
    });
})

router.post("/createUser", function(req, res) {
    var body = req.body.body;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = re.test(body.email) ? body.email : null;
    var password = body.password;
    var confirmPassword = body.confirmPassword;
    var username = body.username;
    var check = body.checked;
    if (check) {
        User.createUser(username, email, password, confirmPassword, check).then(function (data) {
            res.send(data);
        }, (err)=> {
            res.status(403).send(err);
        });
    } else {
        res.status(403).send("Please confirm agreements");
    }
});

router.get("/verifyPasswordCode/:id", function(req, res) {
    var reset_password_code = req.params.id;
    User.verifyPasswordCode({reset_password_code: reset_password_code}).then(function (data) {
        res.send(data);
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.post("/resetPassword", function(req, res) {
    var email = req.body.body.email;
    User.resetPassword(email).then(function (data) {
        res.status(200).send(data);
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.post("/contactUs", function(req, res) {
    var email = req.body.email;
    var username =  req.body.username;
    var subject =  req.body.subject;
    var message =  req.body.message;

    User.contactUs(email, username, subject, message).then(function (data) {
        res.send(data);
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.post("/saveUser", function(req, res) {
    var body = req.body.body;
    var emailType = req.body.emailType;
    User.saveUser(body, emailType).then(function (data) {
        req.login(data, function(err) {
            if (err) { return next(err); }
            req.session.save(() => {
                return res.status(200).send(data);
            })
        });
    }, (err)=> {
        res.status(403).send(err);
    });
});

router.post("/updateImage", upload.single('file'), function(req, res) {
    var body = req.body;
    var userId = req.user.id;
    User.getUserById(userId).then(data => {
        var dest =  path.join( __dirname,'../../../public/images');
        var filename = dest + "/file-" + (data.image != null ? data.image.split("file-")[1] : "");
        fs.unlink(filename, function() {
            User.updateImage(body, req.file, userId).then(function (data) {
                res.send(200, data);
            }, (err)=> {
                res.status(403).send(err);
            })
        });
    }, err => {
        res.status(403).send(err);
    })
});

router.post("/updateUserData", function(req, res) {
    var body = req.body.body;
    var userId = req.user.id;
    User.updateUserData(body, userId).then(function (data) {
        res.send(data);
    }, (err)=> {
        res.status(403).send(err);
    })
});

router.post("/updatePassword", function(req, res) {
    var body = req.body.body;
    var userId = req.user.id;
    User.updatePassword(body, userId).then(function (data) {

        console.log(data);
        res.send(data);
    }, (err)=> {
        console.log( "error" + err );
        res.status(403).send(err);
    })
});

router.post("/changePasswordByCode", function(req, res) {
    var body = req.body;
    User.updatePasswordByCode(body).then(function (data) {
        res.status(200).send(data);
    }, (err)=> {
        res.status(403).send(err);
    })
});

router.post('/authenticate', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(403).send({error: "User not found"}); }
        req.login(user, function(err) {
            if (err) { return next(err); }
            req.session.save(() => {
                return res.status(200).send(user);
            })
        });
    })(req, res, next);
});

router.post('/logout', function(req, res) {
    req.logout();
    res.send(200, "ok");
});

module.exports = router;