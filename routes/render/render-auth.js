var express = require('express');
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/blog/auth-middleware.js');


module.exports = function (passport, router) {

    router.get('/register', function (req, res, next) {
        pageData = {
            template: "register",
            title: app_name,
            sub_title: tag_line,
            page_title: "Register",
            slug: req.params.page_slug,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template, pageData);
    });

    router.get('/login', function (req, res, next) {
        pageData = {
            template: "login",
            title: app_name,
            sub_title: tag_line,
            page_title : "Login",
            slug: req.params.page_slug,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        };
        res.render(pageData.template, pageData);
    });

};
