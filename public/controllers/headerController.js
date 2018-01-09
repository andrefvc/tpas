app.controller("headerCtrl", function($scope, $http, $rootScope, $interval, $location) {

     $scope.limparNotificacao = function(id){
        $http({ 
            method: 'PUT',
            url: '/api/v2/notificacoes/' + id,
            data: {lida: true }
        }).then(function (response) {            
            $http({ 
                method: 'GET',
                url: '/api/v2/notificacoes/utilizador/'+$rootScope.currentUser.id + '/naolidas',
                query: {lida: false }
            }).then(function (response) {            
                $rootScope.notificacoes = response.data.Data;  
            });
        });
    } 
});

app.controller("homeCtrl", function($scope, $http, $rootScope, $interval, $location) {


});