var express = require('express');
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/util/auth-middleware.js');

var mongoose = require("mongoose");
var User = mongoose.model("User");
var UserRole = mongoose.model("UserRole");

module.exports = function (passport, router) {
    require("./admin/users")(passport, router);
    require("./admin/user-roles")(passport, router);
};