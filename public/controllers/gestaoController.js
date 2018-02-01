app.controller("gestaoCtrl", function($q, $scope, $http, $rootScope, $timeout, $location) {

    $scope.viagens = [];
    $scope.viagem = [];

    
    
    $scope.getViagensAll = function() {

        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/viagens',
            params: $location.search()
        }).then(function (response) {            
                $scope.viagens = response.data.Data;                
                App.unblockUI();
                setTimeout(function(){
                    App.init();
                });
        });   
    };
 


    $scope.aprovarViagem = function(viagem){
        
        App.blockUI({ boxed: true });
         $http({ 
            method: 'PUT',
            url: '/api/v2/viagens/' + viagem.id,
            data: {
                aprovadoEm: new Date(),
                aprovadoPor: $rootScope.currentUser.id,
                aprovado: 1 }
        }).then(function (response) {    

            // $scope.partilhado = {'background-color': '#F1C40F;'}
             $scope.getViagensAll();            
            }); 
    }
    

    $scope.openModalViagem = function(viagem){
        $('#modalViagem').modal({ show: 'true' }); 
        App.init();

         $http({ 
            method: 'GET',
            url: '/api/v2/viagens/' + viagem.id,
        }).then(function (response) {            
            $scope.viagem = response.data.Data; 
            $scope.dataInicio =  $scope.viagem.dataInicio;
            $scope.dataFim =   $scope.viagem.dataFim;
            $scope.descricao =  $scope.viagem.descricao;
            $scope.pais =  $scope.viagem.pais;
            $scope.cidade =  $scope.viagem.cidade;
            $scope._user =  $scope.viagem._user.nome;
            $scope.image = [];
            App.unblockUI();
        
            var coords = [];
                setTimeout(function(){
                 
                        coords.push({
                            lat: $scope.viagem.latitude,
                            lng: $scope.viagem.longitude,
                            descricao: $scope.viagem.pais + " - " + $scope.viagem.cidade
                        });
              
             });
            
                MapsGoogle.mapLoadMarkers(coords);

        });   

           

    }


    $scope.getViagemById = function(viagem)
    {
        $http({ 
            method: 'GET',
            url: '/api/v2/viagens/' + viagem.id,
        }).then(function (response) {            
            $scope.viagem = response.data.Data; 
            $scope.dataInicio =  $scope.viagem.dataInicio;
            $scope.dataFim =   $scope.viagem.dataFim;
            $scope.descricao =  $scope.viagem.descricao;
            $scope.pais =  $scope.viagem.pais;
            $scope.cidade =  $scope.viagem.cidade;
            $scope._user =  $scope.viagem._user.nome;
            $scope.image = [];
            App.unblockUI();
        
        });   
    }


    $scope.removerViagem = function(viagem){
    
        App.blockUI({ boxed: true });
        $http({ 
           method: 'DELETE',
           url: '/api/v2/viagens/' + viagem.id
        }).then(function (response) {

            toastr.success('Viagem removida!');

            $scope.getViagensAll();
            App.unblockUI();
        });

    
    }
    
});