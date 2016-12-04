var blogPosts = angular.module("blogPosts", ['hc.marked']);

blogPosts.config(['markedProvider', function (markedProvider) {
    markedProvider.setOptions({
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
}]);

blogPosts.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

blogPosts.controller("blogPostsController", ["$scope", "$http", function ($scope, $http) {
    $scope.nextPage = 1;
    $scope.isLastPage = $scope.currentPage >= $scope.pages;
    $scope.blogData = [];

    $scope.getBlogData = function (pagenumber) {
        var req = {
            method: 'GET',
            url: '/blog-posts?page=' + pagenumber,
        };
        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                $scope.error = res.data.error;
            }
            else {
                $scope.blogData.push.apply($scope.blogData, res.data.postData);
                $scope.pages = res.data.totalPages;
                $scope.isLastPage = $scope.nextPage >= $scope.pages;
                $scope.nextPage++;


            }
        });
    };

    $scope.getBlogPostData = function(pageSlug){
        var req = {
            method: 'GET',
            url: '/blog-post?page_slug=' + pageSlug
        };
        $http(req).then(function(res,status,headers,config){
            if(res.data.error != null){
                $scope.error = res.data.error;
            }
            else{
                $scope.blogPostData = res.data;
            }
            
        });
    };
}]);