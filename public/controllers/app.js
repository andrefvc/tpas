var app = angular.module("tripsApp", ["ngRoute", "ngCookies", "oc.lazyLoad", "angularCSS"]);

app.config(['$routeProvider','$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'views/login.html'
        })
        .when('/register', {
            controller: 'LoginController',
            templateUrl: 'views/register.html',            
        })
        .when('/momentos', {
            controller: 'momentosCtrl',
            templateUrl: 'views/momentos.html',            
        })
        .when('/search', {
            controller: 'searchCtrl',
            templateUrl: 'views/search.html',            
        })
        .when('/profile', {
            controller: 'profileCtrl',
            templateUrl: 'views/profile.html',            
        })
        .when('/viagens', {
            templateUrl : "views/viagens.html",      
            controller: 'viagensCtrl'
        })
        .when('/gestao', {
            templateUrl : "views/gestao.html",      
            controller: 'gestaoCtrl'
        })
        .when('/publicViagens', {
            controller: 'viagensCtrl',
            templateUrl: 'views/viagens.html',            
        })
        .when('/', {
            controller: 'homeCtrl',
            templateUrl: 'views/home.html',            
        })
        .when('/home', {
            templateUrl : "views/home.html",
            controller: 'homeCtrl'
        })
        .when('/dashboard', {
            controller: 'dashboardController',
            templateUrl: 'views/dashboard.html'
        })
        .otherwise({ redirectTo: '/login' });

    $httpProvider.interceptors.push(['$q', '$location', '$rootScope', '$cookieStore',
        function($q, $location, $rootScope, $cookieStore) {
        return {
        'response': function(response) {
            if (response.config.method.toUpperCase() !== 'GET') {
            //console.info('successful GET');
            }
            return response || $q.when(response);
        },
        'responseError': function(response) {
            //toastr.clear();
            switch (response.status) {
                case 400:
                toastr.error(response.data.Message);
                break;
            case 401:
                toastr.clear();
                toastr.error(response.data.Message);
                $location.url('/login');
                console.dir('wrong usename or password');
                break;
            case 403:
                toastr.clear();
                toastr.error(response.data.Message);
                $location.url('/login');
                console.info('no rights to do this');
                break;
            case 404:
                //toastr.info(response.data.Message);
                break;
            case 500:                
                toastr.error(response.data.Message);
                console.info('server internal error: ' + response.data);
                break;
            default:
                if (response.status != -1)
                    toastr.error('error ' + response.status);
                console.info('error ' + response.status + ': ' + response.data);
            }
            App.unblockUI();
            return $q.reject(response);
        }
        };
    }]);
}]);



app.run(['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService',
    function ($rootScope, $location, $cookieStore, $http, AuthenticationService) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        
        if ($rootScope.globals.currentUser)
            $rootScope.currentUser = $rootScope.globals.currentUser.user;

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/search' && $location.path() !== '/publicViagens' && $location.path() !== '/login' && $location.path() !== '/register' && !$rootScope.globals.currentUser) {                
                $location.path('/login');
                return;
            }

            if ($location.path() === '/login'){
                AuthenticationService.ClearCredentials();
                AuthenticationService.Logout();
                return;
            }

            getNotificacoes($rootScope, $http);
            
        });
    }]);
    

app.directive("ngFile", [function () {
    return {
        scope: {
            ngFile: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    //scope.fileread = changeEvent.target.files[0];
                     scope.ngFile = changeEvent.target.files;
                });
            });
        }
    }
}]);


var getNotificacoes = function($rootScope, $http){

    if (!$rootScope.globals.currentUser)
        return;

    $http({ 
        method: 'GET',
        url: '/api/v2/notificacoes/utilizador/'+$rootScope.currentUser.id + '/naolidas',
        query: { lida: false }
    }).then(function (response) {            
            $rootScope.notificacoes = response.data.Data;  
            App.init();
        }, function (response) {
    });
}