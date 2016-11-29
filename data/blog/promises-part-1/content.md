# Promises with mongoose

Very important that we use the promise functionality of mongoose. Or at least these pseudo promises are.

```javascript
    blogPost.find({})
        .sort('-date')
        .populate("blogpost")
        .exec(function (err, posts) {
            if (!posts) {
                //No Post Exists
            } else {
                postData = posts;
            }
            res.render('index.hbs', { title: 'Blog', postData: postData });
    });
```

This makes sure the data is populated before the page is rendered. 

_neat._