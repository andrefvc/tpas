app.controller("viagensCtrl", function($q, $scope, $http, $rootScope, $timeout, $location) {

    $scope.viagens = [];

    var getWeather = function(position) {

        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/localizacao/meteo/lat/' + position.lat + '/lng/ '+ position.lng
        }).then(function (response) {            
                
                $scope.temperatura = response.data.Data;
                
                setTimeout(function(){ 
                    var icons = new Skycons('color', 'blue');
                    angular.forEach($scope.temperatura, function (value, key) {
                        var elements = document.getElementsByClassName(value.icon);
                        for (e = elements.length; e--;){
                            icons.set(elements[e], value.icon );
                        }
                    });
                    icons.play();

                    App.unblockUI();
                    App.init();
                },100);
            });   
    };

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

    $scope.classifica = function(classifica, viagem) {

        if (!$rootScope.currentUser)
            return;

        App.blockUI({ boxed: true });
        $http({ 
            method: 'POST',
            url: '/api/v2/classificacao',
            data: {classifica: classifica, idUtilizador: $rootScope.currentUser.id, idViagem: viagem.id }
        }).then(function (response) {            
                App.unblockUI();

                if (typeof(response.data.Data) == 'string')
                    return;

                if (classifica == 1){
                    $('#class1').css('color:', '#17c613');
                    viagem.sumClass1 += 1;
                }
                if (classifica == 2){
                    $('#class2').css('color:', '#17c613');
                    viagem.sumClass2 += 1;
                }   
                if (classifica == 3){
                    $('#class3').css('color:', '#17c613');
                    viagem.sumClass3 += 1;
                }

            });   
    };

    $scope.viewCommentsViagens = function(viagem){

        $scope.selectedViagem = viagem;

        App.blockUI({ boxed: true });
         $http({ 
            method: 'GET',
            url: '/api/v2/comentarios/viagem/' + viagem.id
        }).then(function (response) {
            $scope.comentarios = response.data.Data;
            
            App.unblockUI();
            $('#responsive').modal({ show: 'true' }); 
            $('#CommentMomentosBtn').toggle();
            $('#comentViagemBtn').css('display','block');
            $('#comentMomentoBtn').css('display','none');

            setTimeout(function() {
                $('#removeCommentMomentosBtn').css('display','none');
                $('#removeCommentViagemBtn').css('display','block');    
            }, 500);

            }, function (response) {
                
                $scope.comentarios = response.data.Data;
                
                App.unblockUI();
                $('#responsive').modal({ show: 'true' }); 
                $('#CommentMomentosBtn').toggle();
                $('#comentViagemBtn').css('display','block');
                $('#comentMomentoBtn').css('display','none');

                setTimeout(function() {
                    $('#removeCommentMomentosBtn').css('display','none');
                    $('#removeCommentViagemBtn').css('display','block');    
                }, 500);
        });           
    };
    
    $scope.removerComentario = function(comentario){
        App.blockUI({ boxed: true });
         $http({ 
            method: 'DELETE',
            url: '/api/v2/comentarios/' + comentario.id,
            data: {idViagem: $scope.selectedViagem.id}
        }).then(function (response) {
            toastr.success('Comentario removido!');
            $scope.selectedViagem.sumComentarios -= 1;
            $scope.viewCommentsViagens($scope.selectedViagem);
            }); 
    }

    $scope.insertComentario = function(comentText){

        var comentario = {
            idViagem: $scope.selectedViagem.id,
            idUtilizador: $rootScope.currentUser.id,
            comentario: comentText,
            _user: $rootScope.currentUser._id
        }

        App.blockUI({ boxed: true });
         $http({ 
            method: 'POST',
            url: '/api/v2/comentarios',
            data: comentario
        }).then(function (response) {
            response.data.Data._user = $rootScope.currentUser;
            $scope.comentarios.push(response.data.Data);
            $scope.selectedViagem.sumComentarios += 1;
            App.unblockUI();

            setTimeout(function() {
                $('#removeCommentMomentosBtn').css('display','none');
                $('#removeCommentViagemBtn').css('display','block');    
            }, 500);
            });           
    };

    $scope.deleteViagemIncricao = function() {

        App.blockUI({ boxed: true });
        $http({ 
            method: 'delete',
            url: '/api/v2/inscricaoViagem/viagem/'+  $location.search().idViagem +'/utilizador/'+$location.search().idUtilizador ,
            params: $location.search()
        }).then(function (response) {            
                             
             });   
    };

    $scope.getViagemIncricao = function(idViagem) {

        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/inscricaoViagem/viagem/'+  idViagem +'/utilizador/'+ $rootScope.currentUser.id ,
  
            params: $location.search()
        }).then(function (response) {            
                $scope.incrito = response.data.Data;                
                App.unblockUI();
                App.init();
               
            });   
    };

    $scope.incrito

    $scope.increveViagem= function(viagem){

        App.blockUI({ boxed: true });
        $http({ 
            method: 'GET',
            url: '/api/v2/inscricaoViagem/viagem/'+  viagem.id +'/utilizador/'+ $rootScope.currentUser.id ,
        }).then(function (response) {            
                $scope.incrito = response.data.Data;   
                if($scope.incrito.id != undefined)
                {
                    $("#incritoViagem").attr("style","background-color:#F1C40F")
                }
                else{
                    $("#incritoViagem").attr("style","background-color:#aaa")
                }
                         
                App.unblockUI();
                App.init();
       });  

    }



    $scope.openModalViagem = function(){
        $('#modalAddViagem').modal({ show: 'true' }); 
        App.init();

        // init datepicker
        $('.date-picker').datepicker({
            rtl: App.isRTL(),
            orientation: "left",
            autoclose: true
        });

        setTimeout(function(){
            MapsGoogle.initAsync(function(position){
                 getWeather(position);
            });
        },1000);
        
        $scope.dataInicio = moment().format('DD-MM-YYYY');
        $scope.dataFim = moment(new Date()).add(1, 'days').format('DD-MM-YYYY');
        $scope.descricao = '';
        $scope.image = [];
        $('#gmap_geocoding_address').val();
    }
    
    $scope.insertViagem = function(){
        
    if (!$rootScope.currentUser)
        return;

    if (!$scope.dataInicio || !$scope.dataFim){
        toastr.warning('falta defenir as datas!')
        return;
    }
    if (!$scope.descricao){        
        toastr.warning('Descrição obrigatória!')
        return;
    }

        var viagem = {            
            idUtilizador: $rootScope.currentUser.id,
            partilhado: (!$('.bootstrap-switch-off')[0]),
            latitude: MapsGoogle.getMarker().lat,
            longitude: MapsGoogle.getMarker().lng,
            dataInicio: new Date( $scope.dataInicio.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") ),
            dataFim: new Date( $scope.dataFim.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") ),
            descricao: $scope.descricao,
            ficheiros: $scope.image[0],
            aprovadoEm: new Date(),
            aprovadoPor: "",
            aprovado: 0,
          //  maxIncricoes = $scope.maxIncricoes
        }        
      
        App.blockUI({ boxed: true });
         $http({ 
            method: 'POST',
            url: '/api/v2/viagens',
            headers: {'Content-Type': undefined},
            data: viagem,        
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }
        }).then(function (response) {
            $scope.getViagens();            
            }); 
    }    

    $scope.partilharViagem = function(viagem){
        
        App.blockUI({ boxed: true });
         $http({ 
            method: 'PUT',
            url: '/api/v2/viagens/' + viagem.id,
            data: {partilhado: !viagem.partilhado }
        }).then(function (response) {            
            $scope.partilhado = {'background-color': '#F1C40F;'}
            $scope.getViagens();            
            }); 
    }

    $scope.removerViagem = function(viagem){
        App.blockUI({ boxed: true });
         $http({ 
            method: 'DELETE',
            url: '/api/v2/viagens/' + viagem.id
        }).then(function (response) {
            toastr.success('Viagem removida!');

            $scope.getViagens();        
            }); 
    }

    $scope.openMomentos = function(viagem){        
        $location.path('/momentos').search({idViagem: viagem.id, idUtilizador: viagem.idUtilizador});
    }

    $scope.isOwner = function(idUser){
        return ($rootScope.currentUser != null && idUser == $rootScope.currentUser.id);
    }

});