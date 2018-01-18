app.controller("gestaoCtrl", function($q, $scope, $http, $rootScope, $timeout, $location) {

    $scope.viagensLst = [];

    $scope.getViagensAll = function() {

        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/viagens',
            params: $location.search()
        }).then(function (response) {            
                $scope.viagens = response.data.Data;                
                App.unblockUI();
                App.init();
            });   
    };


});