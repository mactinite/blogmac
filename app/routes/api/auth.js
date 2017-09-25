var express = require('express');
var Promise = require('promise')
var util = require('util');

module.exports = function (passport, router) {
    /* POST new user to the database
    *  responds with redirect or flash message
    */
    router.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }));

    /* POST new authentication request
    *  responds with redirect or flash message
    */
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    /* GET Logout request
    *  responds with redirect
    */
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}