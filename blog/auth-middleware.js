var mongoose = require("mongoose");
var Promise = require("bluebird");
var util = require('util');
mongoose.Promise = Promise;

var User = mongoose.model("User");
var UserRole = mongoose.model('UserRole');
require('promise/lib/rejection-tracking').enable();

module.exports = {
    IsLoggedIn: function (req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
        // if they aren't redirect them to the home page
        res.redirect('/');
    },
    MatchPermissions: function (permissions) {
        return function (req, res, next) {
            // if user is authenticated in the session, carry on
            if (req.isAuthenticated()) {
                var user = new User(req.user._doc);
                UserRole.findById(user.role, (err, role) => {
                    permissions.forEach(function(permission) {
                        if(!role._doc.permissions[permission])
                            res.redirect('/')
                    }, this);
                    return next();
                });
            }
            else {// if they aren't redirect them to the home page
                res.redirect('/');
            }
        }
    }
}