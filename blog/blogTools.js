var fs = require('fs');
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var blogPost = mongoose.model("BlogPost");


module.exports = {
    getBlogPost: function (res, slug, pageData, callback) {
        blogPost.findOne({ 'page_slug': slug })
            .populate("blogpost")
            .exec(function (err, post) {
                if (!post) {
                    //No Post Exists
                } else {
                    pageData.postData = post;
                    pageData.title = post.title;
                }
                callback(res, pageData);
            });
    },
    getBlogPosts: function (res, pageData, callback) {
        var pageNumber = pageData.pageNumber === undefined ? 1 : pageData.pageNumber;
        var totalPages;
        /*
        blogPost.find({})
            .paginate(pageNumber,5)
            .sort('-date')
            .populate("blogpost")
            .exec(function (err, posts) {
                if (!posts) {
                    //No Post Exists
                } else {
                    pageData.postData = posts;
                }
                callback(res, pageData);
            });
        */
        blogPost.paginate({},{page: pageNumber, limit: 5, sort: {date : -1}}).then( function(result){
            postData = result.docs;
            postData.page = result.page;
            postData.totalPages = result.pages;
            postData.isFirstPage = result.page == 1;
            postData.isLastPage = result.page == result.pages;
            pageData.postData = postData;
            callback(res,pageData);
        });

    },
    //TODO: Refactor this pls
    writeBlogPost: function (req, res) {
        console.log(req.body);
        var newPost = new blogPost();
        
        if(req.user.role >= 2) {
            res.send({ error: "Not enough permissions!" });
            return console.error("User " + req.user.email + " does not have enough permissions to post.");
        }

        if (req.body.title !== null || req.body.title !== "") {
            newPost.title = req.body.title; //create a slug based on this. Must be unique for the content folder name.
        }
        else {
            res.send({ error: "Post Title Required" });
            return console.error("Post Title Required");
        }
        newPost.date = new Date();
        newPost.author = req.user.username;

        var path = "./data/blog/",
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