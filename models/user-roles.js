var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate')

var Schema = mongoose.Schema;

var UserRole = new Schema({
    name : String,
    permissions : {
        write : Boolean,
        edit : Boolean,
        delete : Boolean,
        admin : Boolean
    }
});

mongoose.model('UserRole',UserRole);