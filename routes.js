var express = require('express');
var blogTools = require(__dirname + '/blog/blogTools.js');

module.exports = function (passport) {
    var router = express.Router();

    function renderPage(res, pageData) {
        res.render(pageData.template, pageData);
    }
    function sendJson(res, pageData) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(pageData));
    }

    /* GET specific post page. */
    router.get('/blog-post/:page_slug', function (req, res, next) {
        pageData = {
            template: "blog-post.hbs",
            title: "", //filled in the getBlogPost method
            postData: {} //filled in the getBlogPost method
        };
        blogTools.getBlogPost(res, req.params.page_slug, pageData, renderPage);
    });

        /* GET blog posts returns json. */
    router.get('/blog-posts', function (req, res, next) {
        pageData = {
            pageNumber: req.query.page,
            postData: {} //filled in the getBlogPosts method
        };
        blogTools.getBlogPosts(res, pageData, sendJson);
    });

    /* GET home page. */
    router.get('/', function (req, res, next) {
        pageData = {
            template: "index.hbs",
            title: "Blog",
            pageNumber: req.query.page,
            user : req.user,
            isAuthenticated : req.isAuthenticated(),
            postData: {} //filled in the getBlogPosts method
        };
        blogTools.getBlogPosts(res, pageData, renderPage);
    });

    //Render the new post page
    router.get('/new-post', isLoggedIn, function (req, res, next) {
        res.render('new_post', { title: 'Create A New Post', user : req.user });
    });

    //Handle new post requests
    router.post("/new-post/submit-post", isLoggedIn, function (req, res) {
        blogTools.writeBlogPost(req, res);
    });

    router.get('/register', function (req, res, next) {
        res.render('register.hbs', { title: 'Register', messages : req.flash('signupMessage')});
    });

    router.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/register',
        failureFlash : true
    }));

    router.get('/login', function (req, res, next) {
        res.render('login.hbs', { title: 'Log in', messages: req.flash('loginMessage')});
    });
    
    router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));

    router.get('/logout', function(req,res){
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