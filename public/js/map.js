var map, infoWindow;
var userLocation = null;

function initMap() {

    // Latlng for map center
    var myLatlng = new google.maps.LatLng(44.4267674, 28.102538399999958);

    var mapOptions = {
        zoom: 6,
        center: myLatlng,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#263c3f"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#6b9a76"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#38414e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#212a37"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9ca5b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#1f2835"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#f3d19c"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2f3948"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#515c6d"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            }
        ]
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
        1: {
            icon:  'Universitate.png'
        },
        0: {
            icon:  'HighSchool.png'
        },
        2: {
            icon:  'PublicRoboticsClub.png'
        },
        3: {
            icon:  'PrivateRoboticsClub.png'
        },
        4: {
            icon:  'company.png'
        }
    };

    var features = [
        {
            position: new google.maps.LatLng(45.6579755,25.601197700000057),
            type: 1,
            description:'University'
        }, {
            position : new google.maps.LatLng(45.4353208, 28.007994499999995),
            type: 0,
            description:'High School'
        },
        {
            position : new google.maps.LatLng(47.1584549, 27.601441799999975),
            type:2,
            description:'Public Robotics Club'
        },
        {
            position : new google.maps.LatLng(44.8564798, 24.8691824),
            type:3,
            description:'Private Robotics Club'
        },
        {
            position : new google.maps.LatLng(44.43272, 25.986659400000008),
            type:4,
            description:'Company'
        }
    ];

    var markers;
    var infowindow = new google.maps.InfoWindow();
    var i = 0;
    features.forEach(function(feature) {
        i = i + 1;
        var marker = new google.maps.Marker({
            position: feature.position,
            title: feature.description,
            icon: icons[feature.type].icon,
        });

        // makeInfoWindowEvent(map, infowindow, "<div id=\"content\">\n" +
        makeInfoWindowEvent(marker, infowindow, "<div id=\"content\">\n" +
            "  <div id=\"siteNotice\">\n" +
            "  </div>\n" +
            '<h4 id="firstHeading" class="firstHeading">Accenture</h4>'+
            "  <div id=\"bodyContent\">\n" +
            //" <div class=\"p-3 mb-2 bg-dark text-white\">Accenture</div>\n"+
            "  <img src=\"header.jpg\" class=\"centerImage\" height=\"100\" width=\"150\">\n" +
            "  </div>\n" +
            "  <p class=\"text-dark\">insert adress here</p>\n" +
            "  <p class=\"text-dark\">insert contact details here</p>\n" +
            "  <p class=\"text-dark\">insert description here</p>\n" +
            "  <p class=\"text-dark\">insert % of women here</p>\n" +
            "  <p class=\"text-dark\">insert rating here</p>\n" +
            "  <p class=\"text-dark\">insert top3 feedback here</p>\n" +
            "  </div>\n" +
            "  <p class=\"text-dark\">insert overall sentiment :) here</p>\n"+
            " <button id=\"close-image\" class=\"button\"  style=\"border:transparent ; background-color: transparent;\" ><img src=\"SeeEvents.png\"</button>", marker);
        //<button style="border:1px solid black; background-color: transparent;">Test</button>
        marker.setMap(map);
    });
}

    function makeInfoWindowEvent(map, infowindow, contentString, marker) {

        google.maps.event.addListener(marker, 'click', function() {
            google.maps.event.addListener(infowindow, 'domready', function() {

                // Reference to the DIV that wraps the bottom of infowindow
                var iwOuter = $('.gm-style-iw');

                /* Since this div is in a position prior to .gm-div style-iw.
                 * We use jQuery and create a iwBackground variable,
                 * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
                */
                var iwBackground = iwOuter.prev();

                // Removes background shadow DIV
                iwBackground.children(':nth-child(2)').css({'display' : 'none'});

                // Removes white background DIV
                iwBackground.children(':nth-child(4)').css({'background-color':'#f8fff7'});

            });
            infowindow.setContent(contentString);
            infowindow.open(map, marker);

        });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}