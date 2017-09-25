var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;
var validator = require('validator');
var marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

var BlogPost = new Schema({
    page_slug: {
        type: String,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: Date,
    lastEdited: Date,
    content: {
        markdown: String,
        html: String,
    }
});



mongoosePaginate(BlogPost);
BlogPost.plugin(uniqueValidator);

BlogPost.statics.getBlogPost = function(slug){
    return new Promise((resolve,reject)=>{
        this.findOne({ 'page_slug': slug }).
        lean()
        .populate("blogpost")
        .exec((err, post) => {
            if (!post) {
                reject({error : "No Such Post Exists!"});
            } else {                    
                resolve(post);
            }
        });
    });
};
BlogPost.statics.getBlogPosts = function(pageNumber){
    return new Promise(function (resolve, reject) {
        blogPost.paginate({}, { page: pageNumber, leanWithId: true, lean: true, limit: 4, sort: { date: -1 } }).then(result => {
            var postData = result.docs;
            pageData.totalPages = result.pages;
            pageData.postData = postData;
            resolve(pageData);
        }).catch(e => {
            reject(e);
        });
    });
};

BlogPost.statics.createBlogPost = function (title, author, md) {
    return new Promise((resolve, reject) => {
        // parse content into HTML to store in database
        var parsed = marked(md);
        // compose new post for the database
        var post = new this();
        var slug = slugify(title);
        post.page_slug = slug;
        post.author = author;
        post.title = title;
        post.date = new Date();
        post.lastEdited = post.date;
        post.content = {
            markdown: md,
            html: parsed
        };

        post.save(function(err){
            if(err){
                reject({error : "Title must be unique!"});
            }
            else{
                resolve(post);
            }
        });

    });
};

BlogPost.statics.updateBlogPost = function (page_slug, title, editor, markdown) {
    //TODO
};

BlogPost.statics.deleteBlogPost = function (page_slug, user, user_role) {
    return new Promise((resolve, reject) => {
        var author = "";
        this.findOne({'page_slug' : page_slug}, 'author', function(err, post){
            if(!err){
                author = post.author;
            }
            else{
                reject(err);
            }

            if(user === author || user_role.toLowerCase() === "admin"){
                //DELETE POST
                this.remove({'page_slug' : page_slug}, function(err){
                    if(!err){
                        resolve({'status' : 'success'});
                    }
                    else{
                        reject(err);
                    }
                });
            }

        });
    });
};



var blogPost = mongoose.model('BlogPost', BlogPost);


function generateSlug(title) {
    var slug = slugify(title);
    var query = { page_slug: slug };

    this.findOne(query, function (err, doc) {

    });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}