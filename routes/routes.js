var express = require('express');
var Promise = require('promise');
var util = require('util');

module.exports = function (passport) {
    var router = express.Router();

    //Set up some global variables
    global.app_name = "___'s Blog";
    global.tag_line = "Where I ramble about things.";

    //load api modules
    require("./api/blog")(passport, router);
    require("./api/auth")(passport,router);
    require("./api/admin")(passport,router);

    //load render modules
    require("./render/render-blog")(passport, router);
    require("./render/render-auth")(passport,router);
    require("./render/render-admin")(passport, router);
    
    return router;
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}