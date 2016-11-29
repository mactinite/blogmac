First post of many ;)
Just gonna test some functionality of markdown, don't mind me. 

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

```javascript
var hbs = require('hbs');
var moment = require('moment');
var fs = require('fs');
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

module.exports = {
    registerHelpers: function () {
        hbs.registerHelper('formatTimeUnix', function (date, format) {
            var mmnt = moment.unix(date);
            return mmnt.format(format);
        });
        
        hbs.registerHelper('formatTime', function (date, format) {
            var mmnt = moment(date);
            return mmnt.format(format);
        });

        hbs.registerHelper('markdown', function (options) {
            content = "" + options.fn(this);
            return marked(content);
        });

        hbs.registerHelper('md', function (filepath) {
            var str = fs.readFileSync(filepath, 'utf8');
            return new hbs.handlebars.SafeString(marked(str));
        });
    }
};
```

*neat.*

````cs
using UnityEngine;
using System.Collections;

public class ExampleClass : MonoBehaviour {
    void Awake() {
        DontDestroyOnLoad(transform.gameObject);
    }
}

````
**_really neat._**

TODO: User Authentication :o, Post editing, Saved Drafts, Cached Drafts