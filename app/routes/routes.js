var express = require('express');
var Promise = require('promise');
var util = require('util');
var mongoose = require("mongoose");
var configuration = mongoose.model("Configuration");

module.exports = function (passport) {
    var router = express.Router();

    //Set up some global variables
    configuration.getConfiguration("site_name").then(result =>{
        global.app_name = result.value;
    }).catch(e =>{
        global.app_name = "Null Blog"
    });
    configuration.getConfiguration("tag_line").then(result =>{
        global.tag_line = result.value;
    }).catch(e =>{
        global.tag_line = "Null tag line"
    });

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