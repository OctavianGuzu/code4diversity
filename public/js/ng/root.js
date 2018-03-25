var root = angular.module("root", ['ngRoute']);
var dash = angular.module("dash", ['ngRoute']);
var globalUserName = "";
var globalUserLocation = null;

root.controller("loginController", ["$scope", "$http",function( $scope, $http ) {
	$scope.invalid_user = false;
	$('#LoginBtn').click(function (e) {
		var email = $('#InputEmail').val();
		var pass = $('#InputPassword').val();

		if(email != "" && pass != "") {
			$scope.checkLoogin(email, pass);
		}
	});

    $('#RegisterBtn').click(function (e) {
        var name = $('#exampleInputName').val();
        var email = $('#exampleInputEmail1').val();
        var pass = $('#exampleInputPassword1').val();
        var passConf = $('#exampleConfirmPassword').val();

        if (name != "" && email != "" && pass != "" &&
            passConf != "") {
            var obj = {
                email: email,
                name: name,
                password: pass,
                passwordConf: passConf
            };
            $scope.registerAction(obj);
        }
    })



	$('#registerAcc').click(function (e) {
		window.location.href = '/register';
	});

    $scope.registerAction = function(obj) {
        var data = obj;
        data = JSON.stringify(data);
        $.ajax
          ({
            type: "POST",
            url: "/register",
            dataType: 'json',
            async: true,
            data: data,
            success: function (res){
                if (res.err == true) {
                    alert("Passwords don't match");
                } else {
                    window.location.href = '/index';
                }
            }
        });
    }

	$scope.checkLoogin = function(email, pass, cb) {
		var data2 = {
            logemail: email,
            logpassword: pass
        };
        data2 = JSON.stringify(data2);
        $.ajax
          ({
            type: "POST",
            url: "/",
            dataType: 'json',
            async: true,
            data: data2,
            success: function (res){
                if (res.err == true) {
                    $scope.$apply(function () {
                        $scope.invalid_user = true;
                    });
                } else {
                    window.location.href = '/index';
                }
            }
        });

       // $http.post('/', data).then(function (res) {
       //      console.log(body);
       //      cb(body);
       // })
	}

}]);

dash.controller("dashboardController", ["$scope", "$http", function( $scope, $http ) {
    $scope.entities = null;
    $(document).ready(function () {

        $scope.populateLocs();

        $http.get('/getUserName').then(function (result) {
            $('#titleBox').text("RoboMap 🤖   " + result.data);
        })

        $scope.initMap();
       
    })

    $scope.populateLocs = function () {
         var picker = $("#locPicker");
        //don't forget error handling!
        
        $http.get('/getEntities').then( function (result) {
             $scope.entities = result.data;
            result.data.forEach( function(item) {
                //console.log(item);
                picker.append("<option>" + item.name +  "</option>");
            });
        });

        
    }

    $('#EventInsertBtn').click(function (e) {
        $scope.insertSucc2 = false;
        $scope.insertFail2 = false;


        var name = $('#NameEvent').val();
        var entity = $('#locPicker').val();
        var desc = $('#DescEvent').val();

        if (name != "" && entity != "" && desc != "") {
            var entityId;
            $scope.entities.forEach(function (item) {
                if (item.name == entity)
                    entityId = item._id;
            })
            
            var url_here = "/addEvent?name=" + name +
                "&entityId=" + entityId +
                "&description=" + desc;

            $http.get(url_here)
                .then(function (response) {
                    $scope.insertSucc2 = true;
                    $scope.insertFail2 = false;
                });

        } else {
            $scope.$apply(function () {
                $scope.insertFail2 = true;
            })
        }
    })


    $('#EntityInsertBtn').click(function (e) {
        $scope.insertSucc = false;
        $scope.insertFail = false;

        var name = $('#NameEnt').val();
        var location = $('#LocationEnt').val();
        var type = $('#typePicker').val();
        var address = $('#AddressEnt').val();
        var description = $('#DescriptionEnt').val();
        var imageLink = $('#ImageEnt').val();
        var femPer = $('#FemaleEnt').val();

        if (name != "" && location != "" && type != "" &&
            address != "" && description != "") {

            var url = "/addEntity?name=" + name +
                    "&location=" + location +
                    "&type=" + type +
                    "&address=" + address +
                    "&description=" + description +
                    "&imagelink=" + imageLink +
                    "&femper=" + femPer;
            $http.get(url)
                .then(function (response) {
                    console.log("here");
                    $scope.insertSucc = true;
                    $scope.insertFail = false;
                });         
        } else {
            $scope.$apply(function () {
                $scope.insertFail = true;
            })
        }
    })

    $scope.initMap = function() {

    // Latlng for map center
    var myLatlng = new google.maps.LatLng(44.4267674, 28.102538399999958);

    var mapOptions = {
        zoom: 6,
        center: myLatlng,
        styles: black_map_style
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    console.log("Map init");
   // infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            userLocation = pos;
            globalUserLocation = pos;
            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
            //infoWindow.open(map);
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

    $('#suggestionBtn').click(function (e) {
        var data = {
            loc : globalUserLocation
        };
        $.ajax
        ({
            type: "GET",
            url: "/getSuggestions",
            dataType: 'json',
            async: true,
            data: data,
            success: function (res){

            }
        });
    });

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

var black_map_style = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
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
    "featureType": "administrative.country",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#57581f"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels",
    "stylers": [
      {
        "color": "#ce8b42"
      },
      {
        "visibility": "simplified"
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
    "featureType": "administrative.province",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#414217"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#414217"
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
];
}]);
