app.controller("momentosCtrl", function($q, $scope, $http, $rootScope, $timeout, $location) {

    $scope.momentos = [];

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
    $scope.viagem
    $scope.getMomentos = function() {
        App.blockUI({ boxed: true });

        $scope.validaInscricao();
        $http({
            method: 'GET',
            url: '/api/v2/momentos/viagem/'+ $location.search().idViagem,
        }).then(function (response) {
                
                $http({
                    method: 'GET',
                    url:'/api/v2/viagens/' + $location.search().idViagem,
        
                }).then(function (responseViagem) {
                    $scope.viagem = responseViagem.data.Data;

                    if( $scope.viagem._user.perfil > 0)
                    {
                        $("#btnIncricao").css('display','block');


                          $http({
                        method: 'GET',
                        url:'/api/v2/inscricaoViagem/viagemUser/' + $location.search().idViagem,
            
                    }).then(function (responseVld) {
            
                        $scope.incrito = responseVld.data.Data;
                        if($scope.incrito != undefined)
                        {
                            $("#btnIncricao")[0].innerText = "Remover Inscrição";
                            $("#btnNew").css('display','block');
                        }
                        else{
                            $("#btnNew").css('display','none');
                            $("#btnIncricao")[0].innerText ="Inscrever";
                        }
                        
                    
                    });

                    }
                    else
                    {
                        $("#btnIncricao").css('display','none');
                    }
                                    
            });
            $scope.momentos = response.data.Data;
            App.unblockUI();
        }, function (response) {
            $scope.momentos = response.data.Data;
        });
    };

    $scope.openModalMomento = function(){
        $('#modalAddMomento').modal({ show: 'true' });
            App.init();

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

        $scope.idViagem = $location.search().idViagem;
        $scope.dataInicio = moment().format('DD-MM-YYYY');
        $scope.dataFim = moment(new Date()).add(1, 'days').format('DD-MM-YYYY');
        $scope.descricao = '';
        $scope.narrativa = '';
        $scope.image = [];
        $scope.id = [];
        $('.fileinput-preview').empty();
        $('#gmap_geocoding_address').val();
    }

    $scope.insertMomento = function(){

        var momento = {
            latitude: MapsGoogle.getMarker().lat,
            longitude: MapsGoogle.getMarker().lng,
            dataInicio: new Date( $scope.dataInicio.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") ),
            dataFim: new Date( $scope.dataFim.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") ),
            descricao: $scope.descricao,
            narrativa: $scope.narrativa,
            idViagem: $location.search().idViagem,
            ficheiros: $scope.image[0]
        }

        App.blockUI({ boxed: true });
            $http({
            method: 'POST',
            url: '/api/v2/momentos',
            headers: {'Content-Type': undefined},
            data: momento,
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
            $scope.getMomentos();
        });
    }

    $scope.apagarMomento = function(momento){
        App.blockUI({ boxed: true });
            $http({
                method: 'DELETE',
                url: '/api/v2/momentos/'+ momento.id
            }).then(function (response) {
                $scope.getMomentos();
                toastr.success('Momento removido!');
        });
    }

    $scope.viewCommentsMomentos = function(momento){

        $scope.selectedMomento = momento;

        App.blockUI({ boxed: true });
            $http({
            method: 'GET',
            url: '/api/v2/comentarios/momento/' + momento.id
        }).then(function (response) {
            $scope.comentarios = response.data.Data;

            App.unblockUI();
            $('#responsive').modal({ show: 'true' });
            $('#comentViagemBtn').css('display','none');
            $('#comentMomentoBtn').css('display','block');

            setTimeout(function() {
                $('#removeCommentMomentosBtn').css('display','block');
                $('#removeCommentViagemBtn').css('display','none');
            }, 500);

        }, function (response) {

            $scope.comentarios = response.data.Data;

            App.unblockUI();
            $('#responsive').modal({ show: 'true' });
            $('#comentViagemBtn').css('display','none');
            $('#comentMomentoBtn').css('display','block');

            setTimeout(function() {
                $('#removeCommentMomentosBtn').css('display','block');
                $('#removeCommentViagemBtn').css('display','none');
            }, 500);
        });
    };

    $scope.classifica = function(classifica, momento) {

        if (!$rootScope.currentUser)
            return;

        App.blockUI({ boxed: true });
        $http({
            method: 'POST',
            url: '/api/v2/classificacao',
            data: {classifica: classifica, idUtilizador: $rootScope.currentUser.id, idViagem: $location.search().idViagem, idMomento: momento.id }
        }).then(function (response) {
            App.unblockUI();

            if (typeof(response.data.Data) == 'string')
                return;

            if (classifica == 1){
                $('#class1').css('color:', '#17c613');
                momento.class1 += 1;
            }
            if (classifica == 2){
                $('#class2').css('color:', '#17c613');
                momento.class2 += 1;
            }
            if (classifica == 3){
                $('#class3').css('color:', '#17c613');
                momento.class3 += 1;
            }
        });
    };

    $scope.insertComentarioMomento = function(comentText){

        var comentario = {
            idMomento: $scope.selectedMomento.id,
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
            $scope.selectedMomento.sumComentarios += 1;
            App.unblockUI();

            setTimeout(function() {
                $('#removeCommentMomentosBtn').css('display','block');
                $('#removeCommentViagemBtn').css('display','none');
            }, 500);
        });
    };

    $scope.removerComentarioMomento = function(comentario){
        App.blockUI({ boxed: true });
         $http({
            method: 'DELETE',
            url: '/api/v2/comentarios/' + comentario.id,
            data: { idMomento: $scope.selectedMomento.id}
        }).then(function (response) {
            toastr.success('Comentario removido!');
            $scope.selectedMomento.sumComentarios -= 1;
            $scope.viewCommentsMomentos($scope.selectedMomento);
            });
    }

     $scope.isOwnerMomentos = function(){
        return ($rootScope.currentUser != null && $location.search().idUtilizador == $rootScope.currentUser.id);
    }
    $scope.isPerfilGestao = function(){
        return ($location.search().perfil >0);
    }

    $scope.incrito
    $scope.validaInscricao = function(idViagem){

        $http({
            method: 'GET',
            url:'/api/v2/inscricaoViagem/viagemUser' + idViagem,

        }).then(function (response) {

            $scope.incrito = response.data.Data;
            if($scope.incrito != undefined)
            {
                $("#btnIncricao")[0].innerText = "Remover Inscrição"
                $("#btnNew").css('display','block');
            }
            else{
                $("#btnIncricao")[0].innerText ="Inscrever"
                $("#btnNew").css('display','none');
            }

        });


    }


    $scope.increveViagem= function(){

        App.blockUI({ boxed: true });
        $http({
            method: 'GET',
            url: '/api/v2/inscricaoViagem/viagem/'+ $location.search().idViagem +'/utilizador/'+ $rootScope.currentUser.id ,
        }).then(function (response) {
                $scope.incrito = response.data.Data;
                if($scope.incrito.id != undefined)
                {
                    $("#btnIncricao")[0].innerText = "Remover Inscrição"
                    $("#btnNew").css('display','block');
                }
                else{
                    $("#btnIncricao")[0].innerText ="Inscrever"
                    $("#btnNew").css('display','none');
                }
    

                App.unblockUI();
                App.init();
       });

    }


});
