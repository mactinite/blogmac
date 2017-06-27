var express = require('express');
var Promise = require('promise');
var util = require('util');


module.exports = function (passport,router) {

        router.get('/admin', isLoggedIn,function (req, res, next) {
        pageData = {
            template: "admin.hbs",
            title: app_name,
            sub_title: "Admininstration",
            postData: {}
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