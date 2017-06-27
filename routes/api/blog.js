var express = require('express');
var blogTools = require(appRoot + '/blog/blogTools.js');
var Promise = require('promise');
var util = require('util');

module.exports = function (passport,router) {

    /* GET BlogPost where ?page_slug matches db.
    *  Responds with JSON 
    */
    router.get('/blog-post', function (req, res, next) {
        pageData = {
            template: "blog-post.hbs",
            title: app_name,
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

    /* GET BlogPosts at a specific page
    *  Responds with JSON 
    */
    router.get('/blog-posts', function (req, res, next) {
        blogTools.getBlogPosts(req.query.page).then((pageData) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(pageData));
        }).catch((e) => {
            throw e;
        });
    });

    /* Submit new posts to the database
    *  Responds with JSON
    */
    router.post("/new-post/submit-post", isLoggedIn, function (req, res) {
        blogTools.writeBlogPost(req, res);
    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}