
app.controller("dashboardController", function($scope, $http, $rootScope, $interval, $location) {

    $scope.viagens = [];

    $scope.getViagens = function() {

        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/dashboard/viagens',
            params: $location.search()
        }).then(function (response) {            
            $scope.viagensGruped = response.data.Data;                     
            App.unblockUI();
            App.init();
        });   

        $http({ 
            method: 'GET',
            url: '/api/v2/dashboard/visitas',
        }).then(function (response) {        

            var array = [];
            response.data.Data.forEach( function(e){
                array.push(e.visualizacoes);
            })
            $('.sparkline').sparkline(array, {type: 'line'} );           
            App.unblockUI();
            App.init();
        }); 
    };

    $scope.getViagensByPais = function(pais){
        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/dashboard/viagens/pais/' + pais,
        }).then(function (response) {        
                $('#detalheDiv').removeClass('hide');
                $scope.viagens = response.data.Data;                
                App.unblockUI();
                App.init();
            });   
    };

    
    $scope.getVisitas = function(pais){
        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/dashboard/visitas',
        }).then(function (response) {        
            $('.inlinesparkline').sparkline(response.data.Data, {type: 'line'} );           
            App.unblockUI();
            App.init();
        });   
    };
});