var express = require('express');
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/util/auth-middleware.js');

var mongoose = require("mongoose");
var User = mongoose.model("User");
var UserRole = mongoose.model("UserRole");

var UsersController = require('./controllers/users-controller.js');

module.exports = function (passport, router) {
    router.get("/admin/users", authMW.MatchPermissions(['admin']), UsersController.GetAll);
    router.get("/admin/users/:email", authMW.MatchPermissions(['admin']), UsersController.GetByEmail);
    require("./admin/user-roles")(passport, router);
    require("./admin/site-config")(passport, router);
};