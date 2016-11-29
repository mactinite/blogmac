var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

    passport.serializeUser(function(user, done){
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        User.findById(id, function(err, user){
            done(err,user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true

    },
    function(req, email, password, done){

        process.nextTick(function(){

            User.findOne({'email' : email}, function(err, user){
                if(err) return done(err);

                if(user){
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    var newUser = new User();

                    newUser.username = req.body.username;
                    newUser.firstName = req.body.firstName;
                    newUser.lastName = req.body.lastName;
                    newUser.email = email;
                    newUser.role = 5;// set to default role level
                    newUser.signedUp = new Date();
                    newUser.setPassword(password);

                    newUser.save(function(err){
                        if(err) throw err;
                        return done(null,newUser);
                    });
                }
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function (req, email, password, done){
        User.findOne({'email' : email}, function(err, user){
            if(err) return done(err);
            if(!user) return done(null, false, req.flash('loginMessage', 'Wrong password or email'));
            if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong password or email'));
            return done(null,user);
        });
    }));

};