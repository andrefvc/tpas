app.factory('AuthenticationService',
    ['$http', '$cookieStore', '$rootScope', '$timeout',
    function ($http, $cookieStore, $rootScope, $timeout) {
        var service = {};

        service.LoginFacebook = function (facebookID, callback) {
            $http({
                method: 'POST',
                url: '/api/v2/loginFacebook',
                data: { email: 'email', facebookID: facebookID },
                }).then(function (response) {
                    service.SetCredentials(response.data.Data);
                    if (callback)
                        callback(response);                 
                }, function (response) {
                    if (callback)
                        callback(response);
            });   
        };

        service.Login = function (email, password, callback) {
            $http({
                method: 'POST',
                url: '/api/v2/login',
                data: { email: email, password: password },
                }).then(function (response) {
                    service.SetCredentials(response.data.Data);
                    if (callback)
                        callback(response);                
                }, function (response) {
                    if (callback)
                        callback(response);
            });   
        };


        service.Logout = function (callback) {
            $http({
                method: 'POST',
                url: '/api/v2/logout',
                }).then(function (response) {
                    service.ClearCredentials();
                    if (callback)
                        callback(response);                    
                }, function (response) {
                    service.ClearCredentials();
                    if (callback)
                        callback(response);
            });   
        };

        service.Register = function (user, callback) {
            $http({
                method: 'POST',
                url: '/api/v2/registo',
                data: user,
                }).then(function (response) {
                    service.Login(user.email, user.password, callback);               
                }, function (response) {
                    if (callback)
                        callback(response);
            });   
        };

        service.SetCredentials = function (data) {            
            
            service.ClearCredentials();

            $rootScope.globals = {
                currentUser: {
                    user: data,
                    token: data.token
                }      
            };            
            $rootScope.currentUser = data;            
            $http.defaults.headers.common['Authorization'] = data.token; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };

        service.ClearCredentials = function () {            
            $rootScope.globals = null;
            $rootScope.currentUser = null;
            $http.defaults.headers.common.Authorization = null;
            $cookieStore.remove('globals');
            console.log('exit');
        };

        return service;
    }]);