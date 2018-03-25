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

        $scope.populateLocs(-1);

        $http.get('/getUserName').then(function (result) {
            $('#titleBox').text("RoboMap 🤖   " + result.data);
        })
       
    })

    $scope.populateLocs = function (type_opt) {
         var picker = $("#locPicker");
        //don't forget error handling!
        picker.empty();
        
        $http.get('/getEntities').then( function (result) {
             $scope.entities = result.data;
            result.data.forEach( function(item) {
                //console.log(item);
                if (item.type == type_opt || type_opt == -1)
                    picker.append("<option>" + item.name +  "</option>");
            });
            $scope.initMap(type_opt);
        });

        
    }

    $('#addOption').click(function (e) {
        $scope.$apply(function () {
                $scope.insertSucc = false;
                $scope.insertFail = false;
            })
    })

    $('#addEventOption').click(function (e) {
        $scope.$apply(function () {
                $scope.insertSucc2 = false;
                $scope.insertFail2 = false;
            })
    })

    $('#EventInsertBtn').click(function (e) {
        $scope.insertSucc2 = false;
        $scope.insertFail2 = false;


        var name = $('#NameEvent').val();
        var entity = $('#locPicker').val();
        var desc = $('#DescEvent').val();
        var dimensions = {
            learnFactor : $('#dimLearnEvent').val(),
            buildFactor: $('#dimBuildEvent').val(),
            competeFactor: $('#dimCompeteEvent').val(),
            teachFactor: $('#dimTeachEvent').val(),
            networkFactor: $('#dimNetworkEvent').val()
        };

        if (name != "" && entity != "" && desc != "") {
            var entityId;
            $scope.entities.forEach(function (item) {
                if (item.name == entity)
                    entityId = item._id;
            })
            
            var url_here = "/addEvent?name=" + name +
                "&entityId=" + entityId +
                "&description=" + desc +
                "&dimensions=" + JSON.stringify(dimensions);
            console.log(url_here);
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

    $('#searchbtn').click(function (e) {
        var type_value = $('#selectSearch').val();

        var type;
        if (type_value == "Highschool")
            type = 0;
        else if (type_value == "University")
            type = 1;
        else if (type_value == "Public Club")
            type = 2;
        else if (type_value == "Private Club")
            type = 3;
        else if (type_value == "Company")
            type = 4;
        else if (type_value == "All")
            type = -1;
         $scope.populateLocs(type);
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
                   // google.maps.event.trigger($scope.map, 'resize');
                    $scope.populateLocs(-1);
                    $scope.insertSucc = true;
                    $scope.insertFail = false;
                });         
        } else {
            $scope.$apply(function () {
                $scope.insertFail = true;
            })
        }
    })

    $scope.initMap = function(type_opt) {

    // Latlng for map center
    var myLatlng = new google.maps.LatLng(44.4267674, 28.102538399999958);

    var mapOptions = {
        zoom: 8,
        center: myLatlng,
        styles: black_map_style
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    console.log("Map init");
    // var infowindow;
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
            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            $scope.map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, $scope.map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, $scope.map.getCenter());
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

    $scope.new_features = [];
    $scope.entities.forEach(function (item) {
        if (item.type == type_opt || type_opt == -1) {
            var obj = {
                position: new google.maps.LatLng(item.lat, item.long),
                type: item.type,
                description: item.description
            };
            var big_obj = {
                obj: obj,
                info: {
                    name: item.name,
                    img: item.imageUrl != "" ? item.imageUrl : "http://img.alibaba.com/photo/10888445/Radio_Controlled_Robosapien_Style_Robot_Toy_Roboactor.jpg",
                    address: item.address,
                    contact: "0755434879",
                    description: item.description,
                    women: item.femaleProc == null ? "48%" : item.femaleProc,
                    rating: item.rating == 0 ? "4.5" : item.rating,
                    sentiment: "happy",
                    _id: item._id
                }
            }
            $scope.new_features.push(big_obj);
        }
    })

    var features = $scope.new_features;

    var markers;
    var infowindow = new google.maps.InfoWindow();
    var i = 0;
    features.forEach(function(feature) {
        i = i + 1;
        var marker = new google.maps.Marker({
            position: feature.obj.position,
            title: feature.obj.description,
            icon: icons[feature.obj.type].icon,
        });

        // makeInfoWindowEvent(map, infowindow, "<div id=\"content\">\n" +
        makeInfoWindowEvent(marker, infowindow, "<div id=\"content\">\n" +
            "  <div id=\"siteNotice\">\n" +
            "  </div>\n" +
            "<h4 id=\"firstHeading\" class=\"firstHeading\">" + feature.info.name + "</h4>"+
            "  <div id=\"bodyContent\">\n" +
            //" <div class=\"p-3 mb-2 bg-dark text-white\">Accenture</div>\n"+
            "  <img src=" + feature.info.img + " class=\"centerImage\" height=\"100\" width=\"150\">\n" +
            "  </div>\n" +
            "  <p class=\"text-dark\">Address: " + feature.info.address + "</p>\n" +
            "  <p class=\"text-dark\">Contact: " + feature.info.contact + "</p>\n" +
            "  <p class=\"text-dark\">Description: " + feature.info.description + "</p>\n" +
            "  <p class=\"text-dark\">Women: " + feature.info.women +"</p>\n" +
            "  <p class=\"text-dark\">Rating:"+ feature.info.rating +"</p>\n" +
            "  </div>\n" +
            "  <p class=\"text-dark\">Overall sentiment: " + feature.info.sentiment + "</p>\n"+
            " <a href=\"#\"  id=\"see-events\"  style=\"border:transparent ; background-color: transparent;\" ><img src=\"SeeEvents.png\"</a>", marker, feature.info._id);
        //<button style="border:1px solid black; background-color: transparent;">Test</button>
        marker.setMap($scope.map);
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
                console.log(res);
                console.log("done");
            }
        });
    });

    function makeInfoWindowEvent(map, infowindow, contentString, marker, _id) {

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
            $('#see-events').click(function (e) {

                $http.get('getEvents').then(function (result) {
                    var events = result.data;
                    var my_events = [];
                    events.forEach(function (event) {
                        if (event.entityId == _id)
                            my_events.push(event);
                    })
                    console.log(my_events);
                    $('#eventBody').empty();
                    $('#eventBody').append("<tr id=\"row" + 0 + "\"></tr>");
                    for(var j = 0; j < my_events.length; j++) {
                        $('#row' + j).html("<td>" + my_events[j].name + "</td><td>"+ my_events[j].description +"</td>");
                        $('#eventBody').append("<tr id=\"row" + (j + 1) + "\"></tr>");
                    }

                    $('#EventsShow').modal('show'); 
                })
            })
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
