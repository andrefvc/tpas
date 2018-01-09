app.controller("searchCtrl", function($scope, $http, $rootScope, $interval, $location) {

    var itemsGET = 2;

    var lock = function(){
        itemsGET --;
        if (itemsGET <= 0){

            App.unblockUI();
        }
    }
    
    $scope.procurar = function(){

        App.blockUI({ boxed: true });

        procuraViagens();
        procuraPessoas();

    }

    var procuraViagens = function(){
        $http({ 
            method: 'GET',
            url: '/api/v2/viagens',
            params: { filtro: $scope.pattern }
        }).then(function (response) {            
                lock();
                $scope.viagens = response.data.Data;

                var coords = [];
                setTimeout(function(){
                    angular.forEach($scope.viagens, function (value, key) {
                        coords.push({
                            lat: value.latitude,
                            lng: value.longitude,
                            descricao: value.pais + " - " + value.cidade
                        });
                });

                MapsGoogle.mapLoadMarkers(coords);
            },1000);
            }, function (response) {
                lock();
        });   
    }

    var procuraPessoas = function(){
        $http({ 
            method: 'GET',
            url: '/api/v2/utilizadores',
            params: { filtro: $scope.pattern }
        }).then(function (response) {            
                lock();
                $scope.pessoas = response.data.Data;
            }, function (response) {
                lock();
        });   
    }

    $scope.openViagem = function(viagem){
        $location.url('/momentos/'+viagem.id);
    }   
});