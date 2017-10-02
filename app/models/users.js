var mongoose = require('mongoose');
var crypto = require("crypto");

var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    salt: String,
    signed_up: Date,
    role : String,
    avatar : String
});

User.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

User.methods.setAvatar = function(image_id){
    this.avatar = image_id;
};

User.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

mongoose.model('User', User);