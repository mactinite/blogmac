var express = require('express');
var Promise = require('promise');
var util = require('util');


module.exports = function (passport, router) {

    router.get('/register', function (req, res, next) {
        pageData = {
            template: "register",
            title: appName,
            sub_title: "Register",
            slug: req.params.page_slug,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template, pageData);
    });

    router.get('/login', function (req, res, next) {
        pageData = {
            template: "login",
            title: appName,
            sub_title: "Log in",
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