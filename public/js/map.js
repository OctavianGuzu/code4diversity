var map, infoWindow;
var userLocation = null;

function initMap() {

        // Latlng for map center
        var myLatlng = new google.maps.LatLng(44.4267674, 28.102538399999958);

        var mapOptions = {
            zoom: 6,
            center: myLatlng,
            scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
            styles: [{
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
            }, {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
            }, {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
            }, {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#dedede"}, {"lightness": 21}]
            }, {
                "elementType": "labels.text.stroke",
                "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
            }, {
                "elementType": "labels.text.fill",
                "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
            }, {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
            }, {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#fefefe"}, {"lightness": 20}]
            }, {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
            }]
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        console.log("Map init");
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                userLocation = pos;
                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

        var icons = {
            university: {
                icon:  'Universitate.png'
            },
            high_school: {
                icon:  'HighSchool.png'
            },
            publicClub: {
                icon:  'PublicRoboticsClub.png'
            },
            privateClub: {
                icon:  'PrivateRoboticsClub.png'
            },
            company: {
                icon:  'company.png'
            }
        };

        var features = [
            {
                position: new google.maps.LatLng(45.6579755,25.601197700000057),
                type: 'university',
                description:'University'
            }, {
                position : new google.maps.LatLng(45.4353208, 28.007994499999995),
                type:'high_school',
                description:'High School'
            },
            {
                position : new google.maps.LatLng(47.1584549, 27.601441799999975),
                type:'publicClub',
                description:'Public Robotics Club'
            },
            {
                position : new google.maps.LatLng(44.8564798, 24.8691824),
                type:'privateClub',
                description:'Private Robotics Club'
            },
            {
                position : new google.maps.LatLng(44.43272, 25.986659400000008),
                type:'company',
                description:'Company'
            }
        ];

        features.forEach(function(feature) {
            var marker = new google.maps.Marker({
                position: feature.position,
                title: feature.description,
                icon: icons[feature.type].icon,

            });
            marker.setMap(map);
        });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}