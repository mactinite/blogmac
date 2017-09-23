````js
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

        hbs.registerHelper('current-year', function(modifier){
            var d = new Date();
            return(d.getFullYear());
        })

        hbs.registerHelper('md', function (filepath) {
            var str = fs.readFileSync(filepath, 'utf8');
            return new hbs.handlebars.SafeString(marked(str));
        });
        hbs.registerHelper("concat", function (json) {
            var concat = '';
            var flipArray = [];
            for (var key in json.hash) {
                flipArray.push(json.hash[key]);
            }
            console.log(flipArray);
            for (var i = (flipArray.length - 1); i >= 0; i--) {
                concat += flipArray[i];
            }

            return concat;
        });
        hbs.registerHelper("times", function (n, block) {
            var accum = '';
            for (var i = 1; i <= n; ++i) {
                accum += block.fn(i);
            }
            return accum;
        });
        hbs.registerHelper("math", function (lvalue, operator, rvalue, options) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);

            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        });
    }
};



````