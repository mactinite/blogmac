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
            url: '/admin/user-roles',
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
            url: '/admin/users',
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
            url: '/admin/user-roles/new',
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
            url: '/admin/default-role',
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

    $scope.setBlogName = function(){
        var req = {
            method: 'POST',
            url: '/admin/config/site-name',
            headers: { 'Content-Type': 'application/json' },
            data: {
                value: $scope.blogName,
            }
        };
        var button = angular.element(document.querySelector( '#blog_name_save'));
        var input = angular.element(document.querySelector('#blog_name'));

        button.addClass('is-loading').attr("disabled")

        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                button.removeClass('is-loading is-info')
                .removeAttr("disabled")
                .addClass("is-danger");
                input.addClass('is-danger');
                $scope.error = res.data.error;
            }
            else {
                input.attr("placeholder",res.data.value);
                button.removeClass('is-loading is-info')
                .removeAttr("disabled")
                .addClass("is-success");
                input.addClass('is-success');
            }
        })
    }


    $scope.setTagLine = function(){
        var req = {
            method: 'POST',
            url: '/admin/config/tag-line',
            headers: { 'Content-Type': 'application/json' },
            data: {
                value: $scope.tagLine,
            }
        };
        var button = angular.element(document.querySelector( '#tag_line_save'));
        var input = angular.element(document.querySelector('#tag_line'));

        button.addClass('is-loading').attr("disabled")

        $http(req).then(function (res, status, headers, config) {
            if (res.data.error != null) {
                button.removeClass('is-loading is-info')
                .removeAttr("disabled")
                .addClass("is-danger");
                input.addClass('is-danger');
                $scope.error = res.data.error;
            }
            else {
                input.attr("placeholder",res.data.value);
                button.removeClass('is-loading is-info')
                .removeAttr("disabled")
                .addClass("is-success");
                input.addClass('is-success');
            }
        })
    }

    $scope.resetState = function(event){
        var element = Angular.element(event.element);
    }

    $scope.removeRole = function (id) {
        var req = {
            method: 'POST',
            url: '/admin/user-roles/delete',
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
}])
.directive('resetState', function() {
    return function(scope, element, attr) {
      element.on('change paste keyup', function() {
        element.removeClass("is-danger is-success");
        if(attr.resetState){
            var button = angular.element(document.querySelector("#" + attr.resetState));
            button.removeClass("is-danger is-success")
            .addClass("is-info");
        }
      });
    };
  });;
