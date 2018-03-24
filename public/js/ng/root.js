var root = angular.module("root", ['ngRoute']);
var dash = angular.module("dash", ['ngRoute']);
var globalUserName = "";

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

    $('#suggestionBtn').click(function (e) {
       /** TODO: sugestion modal*/
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
}]);