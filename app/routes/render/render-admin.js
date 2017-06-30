var express = require('express');
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/util/auth-middleware.js');


module.exports = function (passport,router) {

    router.get('/admin', authMW.MatchPermissions(['admin']) ,function (req, res, next) {
        pageData = {
            template: "admin.hbs",
            title: app_name,
            sub_title: tag_line,
            page_title:"Administration",
            postData: {}
        };
        res.render(pageData.template, pageData);
    });

};
