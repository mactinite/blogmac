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
        username : String,
        email : String
    },
    title: {
        type: String,
        required: true
    },
    date: Date,
    lastEdited: Date,
    editedBy : {
        username : String,
        email : String
    },
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
        post.author = {username: author.username, email : author.email};
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

BlogPost.statics.updateBlogPost = function (old_page_slug ,page_slug, title, editor, markdown, canEdit) {
    return new Promise((resolve, reject) => {
        var query = {page_slug : old_page_slug};
        this.findOne(query, (err, post)=> {

            if(err){
                reject({"error" : "Could not find post."});
            }
            else if(editor.email != post._doc.author.email || !canEdit){
                reject({"error" : "You don't have permission to edit this post."})
            }
            else{

                // update the post
                post.page_slug = page_slug;
                post.title = title;
                post.editedBy = {username: editor.username, email : editor.email};;
                post.lastEdited = new Date();
                post.content.markdown = markdown;
                post.content.html = marked(markdown);
                post.save((err, updatedPost) => {
                    if(err){
                        reject({"error" : "Post not valid, please try again."});
                    }
                    else{
                        resolve({"status" : "success"});
                    }
                });
            }
        });
    });
};

BlogPost.statics.deleteBlogPost = function (page_slug, user, user_role) {
    return new Promise((resolve, reject) => {
        var author = {};
        this.findOne({'page_slug': page_slug }).lean().populate("blogpost")
        .exec((err, post) => {
            if(!err && post !=null){
                author = post.author;
            }
            else{
                reject({"error" : "Could not find post to delete."});
            }

            if(user.email === author.email || user_role.toLowerCase() === "administrator"){
                //DELETE POST
                this.remove({'page_slug' : page_slug}, function(err){
                    if(!err){
                        resolve({'status' : 'success'});
                    }
                    else{
                        reject({"error" : "Could not find post to delete."});
                    }
                });
            }
            else{
                reject({"error" : "You're not allowed to delete that."});
            }
        });

    });
};

BlogPost.statics.getPostAuthor = function(page_slug){
    return new Promise((resolve, reject) => {
        this.findOne({'page_slug': page_slug }).lean().populate("blogpost")
        .exec((err, post) => {
            if(err){
                reject({error : "Could not find post"});
            }
            resolve(post.author);
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