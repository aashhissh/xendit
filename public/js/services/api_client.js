angular.module('userService', [])

// super simple service
// each function returns a promise object
    .factory('User', ['$http',function($http) {
        return {
            search : function(user_id) {
                var url = 'http://xendit-user-service-staging.uppju9xwxz.us-west-2.elasticbeanstalk.com' + user_id;
                return $http.get((url), {
                    headers: { "X-API-KEY": "jvvvWNr22Gh8zdtJZE9aVx3H"}
                }).then(function (result) {
                    return result;
                }).catch(function (error) {
                    throw error;
                });
            }
        }
    }]);