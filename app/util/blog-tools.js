var fs = require('fs');
var mongoose = require("mongoose");
var Promise = require("bluebird");
var util = require('util');
mongoose.Promise = Promise;

var blogPost = mongoose.model("BlogPost");
var UserRole = mongoose.model('UserRole');
require('promise/lib/rejection-tracking').enable();

module.exports = {
    getBlogPost: function (slug) {
        return new Promise((resolve,reject)=>{
            blogPost.findOne({ 'page_slug': slug }).
            lean()
            .populate("blogpost")
            .exec((err, post) => {
                if (!post) {
                    reject({error : "No Such Post Exists!"});
                } else {                    
                    post.content = fs.readFileSync(("./public/data/blog/" + post.page_slug + "/content.md"), "UTF-8");
                    resolve(post);
                }
            });
        });

    },
    getBlogPosts: function (pageNumber) {
        return new Promise(function (resolve, reject) {
            blogPost.paginate({}, { page: pageNumber, leanWithId: true, lean: true, limit: 5, sort: { date: -1 } }).then(result => {
                var postData = result.docs;
                pageData.totalPages = result.pages;
                postData.forEach((post, index, array) => {
                        array[index].content = fs.readFileSync(("./public/data/blog/" + post.page_slug + "/content.md"), "UTF-8");
                });
                pageData.postData = postData;
                resolve(pageData);
            }).catch(e => {
                reject(e);
            });
        });
    },
    //TODO: Refactor this pls
    writeBlogPost: function (req, res) {
        console.log(req.body);
        var newPost = new blogPost();

        if (req.body.title !== null || req.body.title !== "") {
            newPost.title = req.body.title; //create a slug based on this. Must be unique for the content folder name.
        }
        else {
            res.send({ error: "Post Title Required" });
            return console.error("Post Title Required");
        }
        newPost.date = new Date();
        newPost.author = req.user.username;

        var path = "./public/data/blog/",
            slug = slugify(newPost.title),
            bodyContent = req.body.content.toString(),
            count = 0;

        while (writeContentFile(path, slug, bodyContent)) {
            console.log("regenerating slug...");
            slug = slugify(newPost.title) + "-" + count;
            count++;
        }

        newPost.page_slug = slug;

        newPost.save(function (err) {
            if (err) {
                res.send({ error: "Database Error" });
                return console.error(err);
            }
        });
        res.send({ doRedirect: true, url: "../" });
    }
};

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function fileExists(path) {
    try {
        fs.accessSync(path, fs.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

function writeContentFile(path, slug, content) {
    var fileOptions = { encoding: "UTF-8" };

    if (!fileExists(path + slug + "/content.md")) {
        //if the file does not exist, we are in the clear and can write our file
        fs.mkdirSync(path + slug, function (err) {
            if (err) return console.log(err);
        });

        fs.writeFileSync(path + slug + "/content.md", content, fileOptions, function (err) {
            if (err) return console.log(err);
            return true;
        });
        return false;
    }
    else {
        //file does exist, that means a blog post already exists with this slug. We need to regenerate the slug.
        console.log("File Already Exists");
        return true;
    }
}