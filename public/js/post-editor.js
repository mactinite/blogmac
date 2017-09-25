var markedApp = angular.module('markedApp', ['ngSanitize']);
// basic config for marked library - this will provide us with GitHub flavored markdown
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    // this function pipes code through highlight.js
    highlight: function (code, lang) {
        // in case, there is code without language specified
        if (lang) {
            return hljs.highlight(lang, code).value;
        } else {
            return hljs.highlightAuto(code).value;
        }
    }
});

markedApp.controller('markedController', ['$scope', '$http', function ($scope, $http) {
    var markdown = this;  // alias for this, so we can access it in $scope.$watch
    this.showPreview = false;
    this.inputText = '';
    this.title;
    $scope.$watch('marked.inputText', function (current, original) {
        markdown.outputText = marked(current);
    });

    this.data = { title: markdown.title, content: markdown.inputText };

    $scope.Submit = function (event) {
        var req = {
            method: 'POST',
            url: 'blog/new-post/submit-post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { title: markdown.title, content: markdown.inputText }
        };
        angular.element(event.target).addClass("is-loading");
        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                $scope.error = res.data.error;
                angular.element(event.target).addClass("is-danger")
                .removeClass('is-loading is-primary');
            }
            else {
                $scope.message = "Successfully Posted!";
                angular.element(event.target).addClass("is-success")
                .removeClass('is-loading is-primary');
                location.href = res.data.url;
            }
        });
    };

}]);