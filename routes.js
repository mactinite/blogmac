var express = require('express');
var blogTools = require(__dirname + '/blog/blogTools.js');
var Promise = require('promise')
var util = require('util');

module.exports = function (passport) {
    var router = express.Router();

    function renderPage(res, pageData) {
        res.render(pageData.template, pageData);
    }
        /* GET specific post page. */
    router.get('/blog-post/:page_slug', function (req, res, next) {
        pageData = {
            template: "blog-post.hbs",
            title: "Blog",
            sub_title: "Where I ramble about things.",
            slug :req.params.page_slug,
            user: req.user,       
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template,pageData);
    });

        /* GET specific post returns json. */
    router.get('/blog-post', function (req, res, next) {
        pageData = {
            template: "blog-post.hbs",
            title: "Blog",
            sub_title: "Where I ramble about things.",
            postData: {}
        };
        blogTools.getBlogPost(req.query.page_slug).then(data => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        }).catch(e => {
            res.send(e);
        });
    });

    /* GET blog posts returns json. */
    router.get('/blog-posts', function (req, res, next) {
        blogTools.getBlogPosts(req.query.page).then((pageData) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(pageData));
        }).catch((e) => {
            throw e;
        });
    });

    /* GET home page. */
    router.get('/', function (req, res, next) {
        pageData = {
            template: "index.hbs",
            title: "Blog",
            sub_title: "Where I ramble about things.",
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template, pageData);
    });

    //Render the new post page
    router.get('/new-post', isLoggedIn, function (req, res, next) {
        pageData = {
            template: "new_post",
            title: "Blog",
            sub_title: "Create a New Post",
            slug :req.params.page_slug,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template,pageData);
    });

    //Handle new post requests
    router.post("/new-post/submit-post", isLoggedIn, function (req, res) {
        blogTools.writeBlogPost(req, res);
    });

    router.get('/register', function (req, res, next) {
        res.render('register.hbs', { title: 'Register', messages: req.flash('signupMessage') });
    });

    router.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }));

    router.get('/login', function (req, res, next) {
        res.render('login.hbs', { title: 'Log in', messages: req.flash('loginMessage') });
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}