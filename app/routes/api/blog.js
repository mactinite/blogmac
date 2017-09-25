var express = require('express');
var mongoose = require('mongoose');
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/util/auth-middleware.js');

var BlogPost = mongoose.model("BlogPost");

module.exports = function (passport,router) {

    /* GET BlogPost where ?page_slug matches db.
    *  Responds with JSON 
    */
    router.get('/blog/blog-post', function (req, res, next) {
        BlogPost.getBlogPost(req.query.page_slug).then(data => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        }).catch(e => {
            res.send(e);
        });
    });

    /* GET BlogPosts at a specific page
    *  Responds with JSON 
    */
    router.get('/blog/blog-posts', function (req, res, next) {
        BlogPost.getBlogPosts(req.query.page).then((pageData) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(pageData));
        }).catch((e) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(e);
        });
    });

    /* Submit new posts to the database
    *  Responds with JSON
    */
    router.post("/blog/new-post/submit-post", authMW.MatchPermissions(['write']), function (req, res) {
        var content,user,title;
        content = req.body.content;
        user = req.user.username;
        title = req.body.title;
        BlogPost.createBlogPost(title, user, content).then(function(result){
            if(result){
                res.setHeader('Content-Type', 'application/json');
                res.send({ doRedirect: true, url: "../blog-post/" + result.page_slug });
            }
        }).catch(e => {
            res.setHeader('Content-Type', 'application/json');
            res.send(e);
        });
    });

    router.delete('/blog/blog-post/:page_slug/delete',authMW.MatchPermissions(['write']), function (req, res, next) {
        BlogPost.deleteBlogPost(req.params.page_slug, req.user.username, req.user.role_name).then((pageData) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(pageData));
        }).catch((e) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(e);
        });
    });

};
