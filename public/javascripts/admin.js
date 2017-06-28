var admin = angular.module("admin", []);

admin.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

admin.controller("adminController", ["$scope","$http", function ($scope, $http) {
    $scope.currentView = "Users";
    
    $scope.setView = function(view){
        $scope.currentView = view;
    }
}]);

admin.controller("usersController", ["$scope","$http", function ($scope, $http) {
  

    $scope.getUsers = function () {
        var req = {
            method: 'GET',
            url: '/admin/getAllUsers',
        };
        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                $scope.error = res.data.error;
            }
            else {
                $scope.users = res.data;
            }
        });
    };

}]);

admin.controller("configController", ["$scope","$http", function ($scope, $http) {
    
    $scope.roles = {};
    
    $scope.getRoles = function () {
        var req = {
            method: 'GET',
            url:'/admin/getAllUserRoles',
        };
        $http(req).then(function (res, status, headers, config){
            if(res.data.error !=null){
                $scope.error = res.data.error;
            }
            else{
                $scope.roles = res.data;
            }
        })
    }
}]);
