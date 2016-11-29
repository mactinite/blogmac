var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BlogPost = new Schema({
    page_slug : String,
    author    : String,
    title     : String,
    date      : Date,
    dateLastEdited : Date
});

mongoose.model('BlogPost',BlogPost);