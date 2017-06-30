var express = require('express');
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/util/auth-middleware.js');

var mongoose = require("mongoose");
var User = mongoose.model("User");;

module.exports = function (passport, router) {
    router.get("/admin/users", authMW.MatchPermissions(['admin']), (req, res) => {
        getAllUsers().then((users) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(users));
        }).catch(e => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(e));
        });
    });
};

function getAllUsers() {
    return new Promise((resolve, reject) => {
        User.find({})
            .select('-hash -salt')
            .populate("user", '-hash -salt')
            .exec((err, users) => {
                if (!users) {
                    reject({ error: "No users retrieved!" });
                }
                else {
                    resolve(users);
                }
            });
    });

}