/**
 * Created by Marina on 03.02.2017.
 */
var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    api = require('../services/api'),
    auth = require('../../config'),
  //  multipart = require('connect-multiparty'),
    querystring = require('querystring'),
   // multipartMiddleware = multipart(),
    helpers = require('./../helpers/utils'),
   // Product = require('../models/apps'),
    User = require('../models/user'),
   // File = require('../models/file'),
    _ = require('underscore');

//var apiUrl = auth.services['vrs-source'].url;
// var screenPath = path.join(__dirname,'../../../vrs-client/public/images/screenshot/');
/* Handle Login POST */
// router.post('/login',multipartMiddleware,function(req,res,next){
//     if(req.body.login == auth.admin.username && req.body.password == auth.admin.password){
//         req.session.user = auth.admin;
//         return res.redirect('/');
//     }
//     res.render('login',{error:"Incorrect login or password"});
// });


// router.get('/login',function(req,res,next){
//     res.render('login',{error:''});
// });
//
// router.get('/signout', function(req, res) {
//     req.session.destroy();
//     res.redirect('/login');
// });


// router.use(function(req,res,next){
//     if(!req.session.user){
//         res.redirect('/login');
//     }else{
//         next();
//     }
// });


router.get('/',function(req,res,next) {
    res.render('index');
});

router.get('/pages',function(req,res,next) {
    res.render('pages');
});

// Get All Users
router.get('/users',function(req, res, next) {
    api.request({
        url:'/users/getUsers',
        method : 'GET'
        }).then(function(users_){
            res.render('users', {
                users: users_
            })
        }).catch(function(err){
    });
});

//Get Single User

router.get('/user/:id',function(req,res,next) {
    var obj = {};
    var id = req.params.id;
        api.request({
            url:'/users/getUserByIdFromAdmin/' + id,
            method : 'GET'
        }).then(function(user){
            res.render('user', {
                user: user
            })
        }).catch(function(err) {
            next(err);
        })
});

router.get('/tables',function(req,res,next) {
    res.render('tables')
});

router.get('/user/:id/sites',function(req,res,next) {
    var obj = {};
    var id = req.params.id;
    api.request({
        url:'/sites/getSitesByUserIdFromAdmin/' + id,
        method : 'GET'
    }).then(function(sites){
        res.render('site', {
            sites: sites
        })
    }).catch(function(err) {
        next(err);
    })
});

// Get all packages

router.get('/packages',function(req,res,next) {
    api.request({
        url:'/packages/getPackages',
        method : 'GET'
    }).then(function(packages){
        res.render('packages', {
            packages: packages
        })
    }).catch(function(err) {
        next(err);
    })
});

router.get('/blogs',function(req,res,next) {
    api.request({
        url:'/blogs/getBlogs',
        method : 'GET'
    }).then(function(blogs){
        res.render('blogs', {
            blogs: blogs
        })
    }).catch(function(err) {
        next(err);
    })
});

// Get Blog by id
router.get('/blog/:id',function(req,res,next) {
    var id = req.params.id;
    api.request({
        url: '/blogs/getBlogs/' + id,
        method: 'GET'
    }).then(function (blog) {
        res.render('blog', {
            blog: blog
        })
    }).catch(function (err) {
        next(err);
    })
});



router.get('/newBlog',function(req,res,next) {
    res.render('newBlog');
});

router.post('/newBlog',function(req,res,next) {
    var data = JSON.parse(Object.keys(req.body)[0]);
        api.request({
            url: '/blogs/newBlog',
            method: 'POST',
            body: data
        }).then(function (blogs) {
            res.render('newBlog', {
                blogs: blogs
            })
        }).catch(function (err) {
            next(err);
        })
});


// delete post

router.delete('/deleteBlog/:id',function(req,res,next){
    var id = req.params.id;
    api.request({
            url: '/blogs/deleteBlog/' + id,
            method: 'DELETE'
        }).then(function (blogs) {
            res.send("ok");
        }).catch(function (err) {
            next(err);
        })
});


// edit post

router.put('/editBlog',function(req,res,next) {
    var body = req.body;
    api.request({
        url: '/blogs/editBlog',
        method: 'PUT',
        body: body
    }).then(function (blogs) {
        res.render('newBlog', {
            blogs: blogs
        })
    }).catch(function (err) {
        next(err);
    })
});
module.exports = router;