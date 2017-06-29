var admin = angular.module("admin", []);

admin.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

admin.controller("adminController", ["$scope", "$http", function ($scope, $http) {
    $scope.currentView = "Users";

    $scope.setView = function (view) {
        $scope.currentView = view;
    }

    $scope.getRoles = function () {
        var req = {
            method: 'GET',
            url: '/admin/getAllUserRoles',
        };
        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                $scope.error = res.data.error;
            }
            else {
                
                $scope.roles = res.data;
                $scope.roles.forEach(role=>{
                    if(role.default === true){
                        $scope.defaultRole = role;
                    }
                })
            }
        })
    }

    $scope.getRoles();
}]);

admin.controller("usersController", ["$scope", "$http", function ($scope, $http) {


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
                $scope.users.forEach(function(user) {
                    user.role ={_id: user.role};                  
                }, this);
            }
        });
    };

}]);

admin.controller("configController", ["$scope", "$http", function ($scope, $http) {

    $scope.roles = {};

    $scope.roleName = "";
    $scope.canWrite = false;
    $scope.canEdit = false;
    $scope.canDelete = false;
    $scope.isAdmin = false;

    $scope.addRole = function () {
        var req = {
            method: 'POST',
            url: '/admin/createUserRole',
            headers: { 'Content-Type': 'application/json' },
            data: {
                role_name: $scope.roleName,
                can_write: $scope.canWrite,
                can_edit: $scope.canEdit,
                can_delete: $scope.canDelete,
                is_admin: $scope.isAdmin,
            }
        };
        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                $scope.error = res.data.error;
            }
            else {
                $scope.getRoles();
                $scope.roleName = "";
                $scope.canWrite = false;
                $scope.canEdit = false;
                $scope.canDelete = false;
                $scope.isAdmin = false;
                $scope.roleAddedSuccess = true;
            }
        })
    }

    $scope.setDefaultRole = function(){
        var req = {
            method: 'POST',
            url: '/admin/updateDefaultRole',
            headers: { 'Content-Type': 'application/json' },
            data: {
                role_id: $scope.defaultRole,
            }
        };
        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                $scope.error = res.data.error;
            }
            else {
                $scope.getRoles();
            }
        })
    }

    $scope.removeRole = function (id) {
        var req = {
            method: 'POST',
            url: '/admin/deleteUserRole',
            headers: { 'Content-Type': 'application/json' },
            data: {
                role_id: id,
            }
        };
        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                $scope.error = res.data.error;
            }
            else {
                $scope.getRoles();
                $scope.roleDeletedSuccess = true;
            }
        })
    }
}]);
