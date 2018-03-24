var root = angular.module("root", ['ngRoute']);
var dash = angular.module("dash", ['ngRoute']);
var globalUserName = "";

root.controller("loginController", ["$scope", "$http",function( $scope, $http ) {
	$scope.invalid_user = false;
    console.log("here");
	$('#LoginBtn').click(function (e) {
		var email = $('#InputEmail').val();
		var pass = $('#InputPassword').val();

		if(email != "" && pass != "") {
			$scope.checkLoogin(email, pass, function(resp) {
				if(resp) {
					window.location.href = '/dashboard';
				} else {
					$scope.invalid_user = true;
				}
			});
		}
	});

	$('#registerAcc').click(function (e) {
		window.location.href = '/register';
	});
	$('#forgotPass').click(function (e) {
		window.location.href = '/forgot-pass';
	});

	$scope.checkLoogin = function(email, pass, cb) {
		var url = "/checkLogin?email=" + email + "&pass=" + pass;

		$http.get(url)
			.then(function (response) {
				cb(response.data.data);
			})
	}

}]);

dash.controller("dashboardController", ["$scope", "$http",function( $scope, $http ) {
	$scope.insertSucc = false;
	$scope.insertFail = false;
	$scope.adddedUsers = false;
	var pieChart = null;

	$(document).ready(function(e) {
		$scope.fillTasks();
		$scope.loadChart();
		$scope.fillMessages();
	});

	$scope.fillTasks = function() {
		var getTaskUrl = "/fetchTasks";
		$http.get(getTaskUrl)
			.then(function(response) {

                var appendToHtml = "";
				var tasks = response["data"].data;
                for (var i = 0; i < tasks.length; i++) {
                    appendToHtml += 
                    	'<tr><td>' + tasks[i]["id"] +
                    	'</td><td>' + tasks[i]["name"] +
						'</td><td>' + tasks[i]["Assignee"] +
						'</td><td>' + tasks[i]["Assigner"] +
						'</td><td>' + tasks[i]["Due Date"] +
						'</td><td>' + tasks[i]["Date Created"] +
						'</td><td>' + tasks[i]["Priority"] +
						'</td><td>' + tasks[i]["Description"] +	'</td></tr>';
                }
				$('#dataTable').append(appendToHtml);
		})
	};

    $scope.fillUsers = function() {
        var getUsersUrl = "/fetchUsers";
        var userFullName = "";
            $http.get(getUsersUrl)
            .then(function(response) {

                var appendToHtml = "";
                var users = response["data"].data;
                for (var i = 0; i < users.length; i++) {
                	userFullName = "";
					userFullName +=	users[i]["prenume"] + " " + users[i]["nume"];
                	if (userFullName != globalUserName) {

                        appendToHtml += "<option value=" + "\"" + userFullName + "\"" + ">" + userFullName + "</option>";
                    }
                }
                if (!$scope.adddedUsers) {
                    $('#InputReceiver').append(appendToHtml);
                    $scope.adddedUsers = true;
                }
            })
    };

    $scope.fillMessages = function() {
        var getTaskUrl = "/fetchMessages";
        $http.get(getTaskUrl)
            .then(function(response) {

            	appendToHtml = "";
                var appendToHtml = "";
                var messages = response["data"].data;
                for (i = 0; i < messages.length; i++) {
					appendToHtml +=  '<a class="list-group-item list-group-item-action" href="#">' +
						'<div class="media">' +
                        '<img class="d-flex mr-3 rounded-circle" src="https://i.imgur.com/hEHvhXv.png" alt="">' +
                        '<div class="media-body">' +
						'<strong>' +
						messages[i]['sender'] +
						'</strong>' +
						'<br>' +
						messages[i]['subject'] +
						'</div>' +
                        '</div>' +
                        '</a>';
                }
                $('#unread-messages').append(appendToHtml);
            })
    };

    $('#LogoutBtn').click(function (e) {
        window.location.href = "/";
    })


    $('#TaskInsertBtn').click(function (e) {
    	$scope.insertSucc = false;
		$scope.insertFail = false;
		$scope.DoneSucc = false;

    	var taskName = $('#InputNameTask').val();
    	var assignee = $('#InputAssigneeTask').val();
    	var assigner = $('#InputAssignerTask').val();
    	var dueDate = $('#InputDdateTask').val();
    	var descriptionTask = $('#InputDescriptionTask').val();
    	var priotiryTask = $('#PrioritynTask').val();

    	if(taskName != "" && assignee != "" && assigner &&
    		dueDate != "" && descriptionTask != "") {
    		var url="/addTask?taskName=" + taskName +
    				"&assignee=" + assignee +
    				"&assigner=" + assigner +
    				"&dueDate=" + dueDate +
    				"&descriptionTask=" + descriptionTask +
    				"&priority=" + priotiryTask;
    		$http.get(url)
    			.then(function(response) {
    				//TODO afisare succes pentru inserare
    				window.location.reload();
    				$scope.$apply(function () {
    					
    					$scope.insertSucc = true;
         			});
    				
    			})
    	} else {
    		$scope.$apply(function () {
    				$scope.insertFail = true;
         	});
    	}
    })


	$('#new-message').click(function(e){
        $http.get("/getLoggedUser")
            .then(function(response) {
                var sender = response["data"].data;
                globalUserName = sender;
            });
        $scope.fillUsers();
	});

    $('#MessageSendBtn').click(function (e) {
        $scope.insertSucc = false;
        $scope.insertFail = false;

        var sender = globalUserName;
        var receiver = $('#InputReceiver').val();
        var subject = $('#InputSubject').val();
        var message = $('#InputMessage').val();

        if(receiver && subject && message) {
            var url="/addMessage?sender=" + sender +
				"&receiver="+ receiver +
                "&subject=" + subject +
                "&message=" + message;
            $http.get(url)
                .then(function(response) {
                    $scope.$apply(function () {

                    });

                })
        } else {
            $scope.$apply(function () {

            });
        }
    });



    $('#DoneBtn').click(function (e) {
    	//window.location.reload();
    	$scope.DoneSucc = false;
    	var taskIDString = $('#IDTask').val();

    	if(taskIDString) {
    		var url = "/doneTask?taskID=" + taskIDString;
    		$http.get(url)
    			.then(function (response) {
    				window.location.reload();
    			})
    	} else {
    		window.location.reload();
    	}
    })

    $scope.loadChart = function () {
    	var url = "/fetchTasksAll";


    	$http.get(url)
    		.then(function (response) {
    			var users = response.data.data;
    			var usersCount = {};

    			for(var i = 0; i < users.length; i++) {
    				if(usersCount[users[i]["Assignee"]]) {
    					usersCount[users[i]["Assignee"]] ++;
    				} else {
    					usersCount[users[i]["Assignee"]] = 1;
    				}
    			}

    			//console.log(usersCount);

    			var chartData = [];

    			for(var key in usersCount) {
    				chartData.push({y: usersCount[key], label: key});
    			}

    			$scope.showChart(chartData);
    		})
    }

    $scope.showChart = function (chartData) {
    	pieChart = new CanvasJS.Chart("PieChart", {
      		animationEnabled: true,
      		title: {
        		text: "Number of Ongoing Tasks"
      		},
      		data: [{
        		type: "pie",
        		startAngle: 0,
        		yValueFormatString: "##0\"\"",
        		indexLabel: "{label} {y}",
        		dataPoints: chartData

      		}]
    	});

    	pieChart.render();
    }

    $('#alertsDropdown').click(function(e) {
    	$('html, body').animate({
        scrollTop: $("#dataTable").offset().top
    }, 2000);
    })

    $('#messagesDropdown').click(function(e) {
    	$('html, body').animate({
        	scrollTop: $("#dataTable").offset().top
   		 }, 2000);
    })

    $('#NavCharts').click(function(e) {
    	$('html, body').animate({
        	scrollTop: $("#myAreaChart").offset().top
   		 }, 2000);
    })

    $('#NavTables').click(function(e) {
    	$('html, body').animate({
        	scrollTop: $("#new-message").offset().top
   		 }, 2000);
    })


    $('#unread-messages').click(function (e) {
    	//console.log(e.target.innerText);
    	var source = e.target.innerText.split("\n");
    	var getTaskUrl = "/fetchMessages";

    	$http.get(getTaskUrl)
    			.then(function (response) {
    				var msgs = response.data.data;

    				for(var i = 0; i < msgs.length; i++) {
    					if(msgs[i]["sender"] == source[0] &&
    						msgs[i]["subject"] == source[1]) {
    						//$scope.$apply(function () {
    							$('#SubjectModalLabel').text(source[1]);
    							$('#FullexampleInputEmail1').text(msgs[i]["message"]);
    						//})
    						break;
    					}
    				}
    			});

    })

}]);