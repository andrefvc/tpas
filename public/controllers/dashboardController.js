
app.controller("dashboardController", function($scope, $http, $rootScope, $interval, $location) {

    $scope.viagens = [];

    $scope.loadDashboard = function() {

        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/dashboard',
            params: $location.search()
        }).then(function (response) {            
            
            $scope.viagensGruped = response.data.Data.viagensByPais;            
            $('#utilizadores')[0].innerText = (response.data.Data.NumUtilizadores);
            $('#viagens').data('data-percent', response.data.Data.taxaEscursoes);
            $('#ocupacao').data('data-percent',response.data.Data.taxaInscritos);

            loadGraph(response.data.Data.visualizacoesByDay);

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



    loadGraph = function(day_data) {
        
        if ($('#non-date-graph').length) {            
            Morris.Line({
                element : 'non-date-graph',
                data : day_data,
                xkey : 'data',
                ykeys : ['visualizacoes'],
                labels : ['visualizacoes'],
                parseTime : false
            });
        }

        $('.easy-pie-chart').each(function() {
            var $this = $(this),
                barColor = $this.css('color') || $this.data('pie-color'),
                trackColor = $this.data('pie-track-color') || 'rgba(0,0,0,0.04)',
                size = parseInt($this.data('pie-size')) || 25;
                
            $this.context.dataset.percent = $($this).data('data-percent');

            $this.easyPieChart({
                
                barColor : barColor,
                trackColor : trackColor,
                scaleColor : false,
                lineCap : 'butt',
                lineWidth : parseInt(size / 8.5),
                animate : 1500,
                rotate : -90,
                size : size,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
                
            });
            
            $this = null;
        });
    }
});