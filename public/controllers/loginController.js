app.controller('LoginController',
    ['$scope', '$rootScope', '$location', '$http', 'AuthenticationService',
    function ($scope, $rootScope, $location, $http, AuthenticationService) {
        App.unblockUI();
        

        $scope.login = function (credentials) {
            AuthenticationService.ClearCredentials();
            $('.alert-danger', $('.login-form')).hide();
            if (!$scope.email || !$scope.password){
                toastr.warning('Email e password obrigatórios');
                return;
            }

            App.blockUI({ boxed: true });
            AuthenticationService.Login($scope.email, $scope.password, function (response) {
                App.unblockUI();
                if (response.status == 200) {
                    AuthenticationService.SetCredentials(response.data.Data);                   
                    $location.path('/home');
                }             
            });
        };

        $scope.loginFacebook = function () {
            AuthenticationService.ClearCredentials();

            App.blockUI({ boxed: true });
            FB.login(function(res) {
                if (res.authResponse) {
                    FB.api('/me', {fields: 'id, email, gender, link, locale, name, timezone, updated_time, verified'},function(respFaceAPI) {
                        AuthenticationService.LoginFacebook(res.authResponse.userID, function (response) {           
                            App.unblockUI();    
                            if (response.status == 200) {
                                AuthenticationService.SetCredentials(response.data.Data);
                                $location.path('/home');
                            } else {
                                $rootScope.newUser={};
                                $rootScope.newUser.nome = respFaceAPI.name;
                                $rootScope.nome = respFaceAPI.name;
                                $rootScope.email = respFaceAPI.email;
                                $rootScope.foto = 'https://graph.facebook.com/'+respFaceAPI.id+'/picture?type=large';
                                $rootScope.newUser.facebook = {};
                                $rootScope.newUser.facebook.id = res.authResponse.userID;
                                $rootScope.newUser.facebook.token = res.authResponse.userID;
                                $location.path('/register');
                            }
                        });
                    });
                } else {
                    App.unblockUI();
                }
            });
        };

        $scope.register = function() {

            if ($scope.password != $scope.rpassword) {
                toastr.warning('Passwords diferentes');
                return;
             }                
            
            var user = {
                nome: $scope.nome,
                email: $scope.email,
                password: $scope.password,
                foto: $rootScope.foto,
                facebook: ($rootScope.newUser != undefined) ? $rootScope.newUser.facebook : undefined
            }

            App.blockUI({ boxed: true });

            AuthenticationService.Register(user, function (response) {     
                App.unblockUI();
                if (response.data.ErrorCode == 200) {
                    AuthenticationService.SetCredentials(response.data.Data);  
                    $location.path('/home');
                }               
            });
        }

        $scope.logout = function() {    

            AuthenticationService.ClearCredentials();

            App.blockUI({ boxed: true });
            AuthenticationService.Logout(function (response) {
                App.unblockUI();
                $location.path('/login');
            });
        };
    }]);
