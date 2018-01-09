app.controller("profileCtrl", function($scope, $http, $rootScope, $interval, $location) {
    
    $scope.isOwner = function(idUser){
        return ($rootScope.currentUser != null && idUser == $rootScope.currentUser.id);
    }

    var itemsGET = 5;


    $scope.loaditems = function(){

        App.blockUI({ boxed: true });
        loadUser();
        loadViagens();
        loadComentarios();
        loadBucketList();
        loadNotificacoes();

    }

    var isLoading = function() {
        itemsGET--;
        if (itemsGET >= 0)
            App.unblockUI();
    }


    var loadUser = function(){
        $http({ 
            method: 'GET',
            url: '/api/v2/utilizadores/'+ $location.search().id,
        }).then(function (response) {            
                $scope.user = response.data.Data;
                isLoading();
            }, function (response) {
                $scope.user = response.data.Data;
                isLoading();
        });
    }

    var loadViagens = function(){
        $http({ 
            method: 'GET',
            url: '/api/v2/viagens/utilizador/'+ $location.search().id
        }).then(function (response) {            
                $scope.viagens = response.data.Data; 
                isLoading();
            }, function (response) {
                $scope.viagens = response.data.Data; 
                isLoading();
        });
    }

    var loadComentarios = function(){
        $http({ 
            method: 'GET',
            url: '/api/v2/comentarios/utilizador/'+$location.search().id
        }).then(function (response) {            
                $scope.comentarios = response.data.Data;  
                isLoading();
            }, function (response) {
                $scope.comentarios = response.data.Data;  
                isLoading();
        });
    }   

    var loadBucketList = function(){
        $http({ 
            method: 'GET',
            url: '/api/v2/bucketlist/utilizador/' + $location.search().id
        }).then(function (response) {            
                $scope.bucketlist = response.data.Data;  
                isLoading();
            }, function (response) {
                $scope.bucketlist = response.data.Data;  
                isLoading();
        });
    }   

    var loadNotificacoes = function(){
        $http({ 
            method: 'GET',
            url: '/api/v2/notificacoes/utilizador/'+$location.search().id
        }).then(function (response) {            
                $scope.notificacoes = response.data.Data;  
                isLoading();
            }, function (response) {
                $scope.notificacoes = response.data.Data;  
                isLoading();
        });
    }
});