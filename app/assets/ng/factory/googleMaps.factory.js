define([], function() {
    return function ($log, $compile, config) {

        var map, latLng, marker, infoWindow,
            geocoder = new google.maps.Geocoder(),
            pet_icon_sm = 'assets/images/paws_sm.png',
            pet_icon_md = 'assets/images/paws_md.png',
            pet_icon_lg = 'assets/images/paws_lg.png';

        var showMap = function(lat, lng, address, s) {
            latLng = new google.maps.LatLng(lat, lng);
            map.setCenter(latLng);
            marker = new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP
            });
            infoWindow = new google.maps.InfoWindow({
                content: '<div id="iw" style="max-width:240px">'+ (address ?
                             'Address:<br>'+ address +'<br>'+'Latitude: '+ lat +'<br>Longitude: '+lng
                                : 'Please drag this red marker anywhere on the map to know the approximate postal address of that location.') +'</div>'
            });
            infoWindow.open(map, marker);
            google.maps.event.addListener(marker, 'dragstart', function(e) {
                infoWindow.close();
            });
            google.maps.event.addListener(marker, 'dragend', function(e) {
                var point = marker.getPosition();
                map.panTo(point);
                geocode(point, s);
            });
        };

        var showAddress = function(address, s) {
            infoWindow.close();
            geocoder.geocode({
                'address': decodeURI(address)
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    marker.setPosition(results[0].geometry.location);
                    geocode(results[0].geometry.location, s);
                }
            });
        };

        var geocode = function(position, s) {
            geocoder.geocode({
                latLng: position
            }, function(responses) {
                var html = '';
                //window.location.hash = '#' + marker.getPosition().lat() + "," + marker.getPosition().lng();
                if (responses && responses.length > 0) {
                    var address = responses[0].formatted_address,
                        lat = marker.getPosition().lat(),
                        lng = marker.getPosition().lng();

                    s.address = address;
                    s.lat = lat;
                    s.lng = lng;

                    html += 'Address:<br/>' + address;
                    html += '<br /><small>' + 'Latitude: '+ lat +'<br />Longitude: '+ lng;
                    html += '</small>';
                } else {
                    html += 'Sorry but Google Maps could not determine the approximate postal address of this location.';
                }
                map.panTo(marker.getPosition());
                infoWindow.setContent("<div id='iw' style='max-width:250px;color:#000'>" + html + "</div>");
                infoWindow.open(map, marker);
            });
        };

        var locationFound = function(position) {
            showMap(position.coords.latitude, position.coords.longitude, '', s);
        };

        var defaultLocation = function(s) {
            showMap(config.default_lat, config.default_long, config.default_address, s);
        };

        var initializeMap = function(id, lat, lng, address, s) {
            var options = {
                zoom: 12,
                fullscreenControl: false,
                panControl: false,
                zoomControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                scaleControl: false,
                scaleControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_RIGHT
                },
                streetViewControl: false,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true
            };
            map = new google.maps.Map(document.getElementById(id), options);

            //lat = null;

            if (lat && lng && address) {
                showMap(lat, lng, address, s);
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(locationFound, defaultLocation);
            } else {
                defaultLocation(s);
            }
        };

        var initializePetMap = function(id, locations, s) {

            var lat = locations[0][1],
                lng = locations[0][2],
                latLng = new google.maps.LatLng(lat, lng);

            var options = {
                zoom: 18,
                fullscreenControl: false,
                center: latLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true
            };

            //add map, the type of map
            var map = new google.maps.Map(document.getElementById(id), options);

            //declare marker call it 'i'
            var marker, i;

            //declare infowindow
            s.petInfowindow = new google.maps.InfoWindow();

            //add marker to each locations
            for (i = 0; i < locations.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon: (locations[i][3] || pet_icon_sm)
                });

                var content =
                    '<div>' +
                        '<b>'+ locations[i][0] +'</b>' +
                        '<a style="cursor: pointer;" ng-click="setPetInfo({}, '+ locations[i][4] +')" class="pull-right">' +
                            '<i class="fa fa-wrench"></i>' +
                        '</a> <br>' +
                        'Latitude: '+ locations[i][1] + '<br>' +
                        'Longitude: '+ locations[i][2] + '<br>' +
                        'Battery: '+ locations[i][5] + '%<br>' +
                        'Speed: '+ locations[i][6] + 'km/h<br>' +
                    '</div>';
                var compiledContent = $compile(content)(s);

                google.maps.event.addListener(marker, 'click', (function(marker, content) {
                    return function() {
                        s.petInfowindow.setContent(content);
                        s.petInfowindow.open(map, marker);
                    }
                })(marker, compiledContent[0]));
            }
        };

        var initializeSinglePetMap = function(id, pet, s) {
            var lat, lng;
            if (pet.position && pet.position.latitude && pet.position.longitude) {
                lat = pet.position.latitude;
                lng = pet.position.longitude;
            } else {
                lat = config.default_lat;
                lng = config.default_lng;
            }

            var latLng = new google.maps.LatLng(lat, lng);
            var options = {
                zoom: 18,
                center: latLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                zoomControl: false,
                draggable: false,
                scrollwheel: false,
                panControl: false,
                scaleControl: false
            };
            var map = new google.maps.Map(document.getElementById(id), options);

            if (pet.position && pet.position.latitude && pet.position.longitude) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: map,
                    icon: pet_icon_lg
                });

                var content =
                    '<div>' +
                        '<b>' + pet.name + '</b><br>' +
                        'Latitude: ' + lat + '<br>' +
                        'Longitude: ' + lng + '<br> ' +
                        'Battery: '+ pet.position.attributes.battery + '%<br>' +
                        'Speed: '+ pet.position.speed + 'km/h<br>' +
                    '</div>';

                var infowindow = new google.maps.InfoWindow();
                infowindow.setContent(content);
                infowindow.open(map, marker);

                $('#' + id).find('.gm-style-iw').next().remove();
            }
        };

        return {
            showAddress: showAddress,
            initializeMap: initializeMap,
            initializePetMap: initializePetMap,
            initializeSinglePetMap: initializeSinglePetMap
        };
    }
});

