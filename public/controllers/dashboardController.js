
app.controller("dashboardController", function($scope, $http, $rootScope, $interval, $location) {


    $scope.viagens = [];

    $scope.getViagens = function() {

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