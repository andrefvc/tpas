var MapsGoogle = function () {

    var markers = [];

    var mapGeocoding = function(callback){
        
        var map;
        var callback = callback;
        
        var myOptions = {
            zoom: 16,
            mapTypeId: 'satellite'
        };
        map = new google.maps.Map($('#gmap_geocoding')[0], myOptions);
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            map.setCenter(pos);
            addMarker(pos);
          }, function() {
            alert('The Geolocation service failed');
          });
        } else {
          alert('Browser doesnt support Geolocation');
          
        }
        
        map.addListener('click', function(event) {
            var pos = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            addMarker(pos);
        });

        var addMarker = function(location) {
            deleteMarkers();
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
            });

            marker.addListener('click', function(event) {
            deleteMarkers();
            });
            
            markers.push(marker);
            callback(location);
        }

        var setMapOnAll = function (map) {
            for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            }
        }

        var clearMarkers = function () {
            setMapOnAll(null);
        }

        var deleteMarkers = function () {
            clearMarkers();
            markers = [];
        }

        var handleAction = function () {
            var text = $.trim($('#gmap_geocoding_address').val());

             this.geocoder = new google.maps.Geocoder();
             this.geocoder.geocode({address: text}, function(results, status) {
                if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    var pos = {
                        lat: latlng.lat(),
                        lng: latlng.lng()
                    };
                    addMarker(pos);
                    map.setCenter(latlng);
                }
            });
        }
        
        $('#gmap_geocoding_btn').click(function (e) {
            e.preventDefault();
            handleAction();
        });

        $("#gmap_geocoding_address").keypress(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == '13') {
                e.preventDefault();
                handleAction();
            }
        });
    }

    var getMarker = function(){
        if (markers[0])
            return {
                lat: markers[0].position.lat(),
                lng: markers[0].position.lng()
            };
        else
            return {
            };
    }

    var mapLoadMarkers = function(coords){
        
        var map;

        var myOptions = {
            zoom: 16,
            mapTypeId: 'satellite'
        };
        map = new google.maps.Map($('#gmap_geocoding')[0], myOptions);
    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map.setCenter(pos);

                angular.forEach(coords, function (value, key) {
                    addMarker(value, value.descricao);
                });
        }, function() {
            alert('The Geolocation service failed');
        });
        } else {
            alert('Browser doesnt support Geolocation');
        }
        
        var addMarker = function(location, title) {
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP
            });

            var infowindow = new google.maps.InfoWindow({
            content: title
            });
            
            infowindow.open(map, marker);
        }
    }

    return {        
        init: function () {
            mapGeocoding();
        },
        initAsync: function (callback) {
            var map = mapGeocoding(callback);
        },
        getMarker: function() { 
            return getMarker()
        },
        mapLoadMarkers: function(coords) { 
            return mapLoadMarkers(coords)
        }
    };
}();