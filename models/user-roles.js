var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserRole = new Schema({
    name : String,
    default : Boolean,
    permissions : {
        write : Boolean,
        edit : Boolean,
        delete : Boolean,
        admin : Boolean
    },
    
});

mongoose.model('UserRole',UserRole);