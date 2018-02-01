app.controller("gestaoCtrl", function($q, $scope, $http, $rootScope, $timeout, $location) {

    $scope.viagens = [];
    $scope.viagem = [];
    $scope.viagemView ={};

    $scope.getViagensAll = function() {
        App.blockUI({ boxed: true });

        $http({ 
            method: 'GET',
            url: '/api/v2/viagens',
            params: $location.search()
        }).then(function (response) {            
                $scope.viagens = response.data.Data;                
                
                setTimeout(function(){
                    App.init();
                    App.unblockUI();
                });
        });   
    };
 
    $scope.aprovarViagem = function(idViagem){        
        App.blockUI({ boxed: true });

         $http({ 
            method: 'PUT',
            url: '/api/v2/viagens/' + idViagem,
            data: {
                aprovadoEm: new Date(),
                aprovadoPor: $rootScope.currentUser.id,
                aprovado: 1 }
        }).then(function (response) {
            App.unblockUI();
            toastr.success('Viagem aprovada com sucesso!');
            $scope.getViagensAll();         
        }); 
    }
    

    $scope.removerViagem = function(idViagem){    
        App.blockUI({ boxed: true });

        $http({ 
           method: 'DELETE',
           url: '/api/v2/viagens/' + idViagem
        }).then(function (response) {
            App.unblockUI();
            toastr.success('Viagem removida com sucesso!');
            $scope.getViagensAll();            
        });
    }    

    
    $scope.openModalViagem = function(idViagem){       
        App.blockUI({ boxed: true });

         $http({ 
            method: 'GET',
            url: '/api/v2/viagens/' + idViagem,
        }).then(function (response) {            
            $scope.viagemView = response.data.Data;
        
            var coords = [];
            setTimeout(function(){
                
                coords.push({
                    lat: $scope.viagemView.latitude,
                    lng: $scope.viagemView.longitude,
                    descricao: $scope.viagemView.pais + " - " + $scope.viagemView.cidade
                });
                MapsGoogle.mapLoadMarkers(coords);
                
                $('#modalViagem').modal({ show: 'true' });   
                // init datepicker
                $('.date-picker').datepicker({
                    rtl: App.isRTL(),
                    orientation: "left",
                    autoclose: true
                });

                App.unblockUI();
                App.init();
             },1000);                
        });
    }
});