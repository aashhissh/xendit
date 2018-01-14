angular.module('userController', [])
    .controller('mainController', ['$scope','$http','User', function($scope, $http, User) {
        $scope.formData = {};
        $scope.loading = false;
        $scope.userData = {};
        $scope.isError = false;
        $scope.responseReceived = false;

        $scope.searchUser = function() {

            if ($scope.formData.user_id !== undefined) {
                $scope.loading = true;

                User.search($scope.formData.user_id)
                    .then(function (result) {
                        $scope.loading = false;
                        $scope.formData = {};
                        $scope.isError = false;
                        $scope.responseReceived = true;
                        $scope.userData = result.data;
                    })
                    .catch(function(error) {
                        $scope.loading = false;
                        $scope.formData = {};
                        $scope.isError = true;
                        $scope.responseReceived = false;
                        $scope.userData = undefined;
                    });
            }
        };
    }]);