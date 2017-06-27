var express = require('express');
var Promise = require('promise');
var util = require('util');


module.exports = function (passport,router) {
    
    /* GET specific post page. */
    router.get('/blog-post/:page_slug', function (req, res, next) {
        pageData = {
            template: "blog-post.hbs",
            title: app_name,
            sub_title: tag_line,
            slug: req.params.page_slug,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template, pageData);
    });

    /* GET home page. */
    router.get('/', function (req, res, next) {
        pageData = {
            template: "index.hbs",
            title: app_name,
            sub_title: tag_line,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template, pageData);
    });

    //Render the new post page
    router.get('/new-post', isLoggedIn, function (req, res, next) {
        pageData = {
            template: "new_post",
            title: app_name,
            sub_title: tag_line,
            page_title: "New Post",
            slug: req.params.page_slug,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template, pageData);
    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}