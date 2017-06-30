var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate')

var Schema = mongoose.Schema;

var BlogPost = new Schema({
    page_slug : String,
    author    : String,
    title     : String,
    date      : Date,
    lastEdited: Date,
    content   :{
        markdown : String,
        html : String,
    }
});

BlogPost.plugin(mongoosePaginate);

mongoose.model('BlogPost',BlogPost);