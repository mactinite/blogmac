var express = require('express');
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/util/auth-middleware.js');

var mongoose = require("mongoose");
var configuration = mongoose.model("Configuration");
var validator = require('validator');

module.exports = function (passport, router) {

    router.post("/admin/config/site-name", authMW.MatchPermissions(['admin']),  (req, res) => {

        configuration.updateConfiguration("site_name",req.body.value).then((result) =>{
            res.setHeader('Content-Type', "application/json");
            app_name = result.value +  "";
            res.send(JSON.stringify(result));
        }).catch(e =>{
            res.setHeader('Content-Type', "application/json");
            res.send(JSON.stringify(e));
        });

    });

    router.post("/admin/config/tag-line", authMW.MatchPermissions(['admin']),  (req, res) => {        
        configuration.updateConfiguration("tag_line",req.body.value).then((result) =>{
            res.setHeader('Content-Type', "application/json");
            tag_line = result.value + "";
            res.send(JSON.stringify(result));
        }).catch(e =>{
            res.setHeader('Content-Type', "application/json");
            res.send(JSON.stringify(e));
        });
    });

};