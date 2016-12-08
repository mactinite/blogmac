var admin = angular.module("admin", []);

admin.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

admin.controller("usersController", ["$scope","$http", function ($scope, $http) {
    $scope.roles = ['Admin', 'Web Master', 'Editor', 'Author','Read-only','Not Activated'];
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