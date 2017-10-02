var express = require('express');
var multer = require('multer')
var upload = multer({ dest: 'uploads/images' })
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/util/auth-middleware.js');

var mongoose = require("mongoose");
var configuration = mongoose.model("User");
var validator = require('validator');

module.exports = function (passport, router) {

    router.post('user/:username/avatar',
        authMW.MatchOwner(), upload.single('avatar'),
        function (req, res, next) {
            console.log(req.file.fiilename);
            res.setHeader('Content-Type', 'application/json');
            response = {status : "success", url : "path/to/image.png"};
            res.send(JSON.stringify(response));
        });
};