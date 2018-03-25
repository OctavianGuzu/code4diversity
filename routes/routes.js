var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Entity = require('../models/entity');
var Event = require('../models/event');
var recommender = require('../routes/util/recomandation');
var https = require('https');

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.render('login');
});

router.post('/', function (req, res, next) {
	var obj;
	for(key in req.body)
		obj = JSON.parse(key);
	var response = {
		err: false
	};

	if (obj.logemail && obj.logpassword) {
		
		User.authenticate(obj.logemail, obj.logpassword, function (error, user) {
			if (error || !user) {
		        response.err = true;
		        res.status(200).send(response);
			} else {
				req.session.userId = user._id;
				res.status(200).send(response);
			}
		})
	} else {
		res.status(200).send(null);
	}
})

router.get('/register', function (req, res, next) {
	res.render('register');
});

router.get('/getSuggestions', function (req, res, next) {
    var events = recommender.getNearEvents(req.query.loc, 3, function(events) {
        res.json(events);
	});
});

router.post('/register', function (req, res, next) {
	var obj;
	for(key in req.body)
		obj = JSON.parse(key);
	var response = {
		err: false
	};
	if (obj.password !== obj.passwordConf) {
		response.err = true;
		res.status(200).send(response);
		return;
	}

	if (obj.email &&
		obj.name &&
		obj.password &&
		obj.passwordConf) {
		var userData = {
			email: obj.email,
			name: obj.name,
			password: obj.password,
			administrator: false
		}

		User.create(userData, function (err, user) {
			if (err) {
				response.err = true;
				res.status(200).send(response);
			} else {
				req.session.userId = user._id;
				res.status(200).send(response);
			}
		})
	} else {
		response.err = true;
		res.status(200).send(response);
	}
});

router.get('/index', function (req, res, next) {
	User.findById (req.session.userId)
		.exec(function (error, user) {
			if (error) {
				return next(error);
			} else {
				if (user == null) {
					return res.redirect('/');
				} else {
					return res.render('index');
				}
			}
		})
})

router.get('/logout', function (req, res, next) {
	console.log("here");
	if (req.session) {
		req.session.destroy(function (err) {
			if (err) {
				res.status(200).send(null);
			} else {
				res.redirect('/');
			}
		})
	}
})

router.get('/getEntities', function (req, res, next) {
	console.log("here");
	Entity.find({}).exec(function (err, result) {
		res.json(result);
	})
})

router.get('/getEvents', function (req, res, next) {
	Event.find({}).exec(function (err, result) {
		res.json(result);
	})
})


router.get('/addEvent', function (req, res, next) {
	var response = {
		status_code : 0,
        status_message : "success",
        data : false
	};

	var obj = {
		entityId: req.query.entityId,
		name: req.query.name,
		description: req.query.description,
        eventDate: req.query.eventDate,
		dimensions: req.query.dimensions,
        entityLng: req.query.entityLng,
        entityLat: req.query.entityLat,
		status: false
	};

	Event.create(obj, function (err, response) {
		console.log(err);
		res.json(response);
	})
})

router.get('/getUserName', function (req, res, next) {
	User.findById(req.session.userId)
		.exec(function (err, user) {
			res.json(user.name);
		})
})

router.get('/addEntity', function (req, res, next) {
	var response = {
		status_code : 0,
        status_message : "success",
        data : false
	};
	var type;
	if (req.query.type == "Highschool")
		type = 0;
	else if (req.query.type == "University")
		type = 1;
	else if (req.query.type == "Public club")
		type = 2;
	else if (req.query.type == "Private club")
		type = 3;
	else if (req.query.type == "Private Company")
		type = 4;
	var obj = {
		location: req.query.location,
		name: req.query.name,
		long: null,
		lat: null,
		femaleProc: req.query.femper,
		imageUrl: req.query.imagelink,
		address: req.query.address,
		description: req.query.description,
		type: type,
		status: false,
		rating: 0
	}
	var where = "https://maps.googleapis.com/maps/api/geocode/json?address=" + req.query.address + "&key=AIzaSyAoJWKTh1B_Hh7CuMVoGnEy3b58F9axNuY"
	https.get(where, (resp) => {
	  let data = '';
	 
	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	 
	  // The whole response has been received. Print out the result.
	  resp.on('end', () => {
	    data = JSON.parse(data);
	    console.log(data);
	    if (data.results[1]) {
		    obj.long = data.results[1].geometry.location.lng;
		    obj.lat = data.results[1].geometry.location.lat;
		} else {
			obj.long = data.results[0].geometry.location.lng;
		    obj.lat = data.results[0].geometry.location.lat;
		}
	    //TODO insert in DB
	    Entity.create(obj, function (err, result) {
	    	res.json(response);
	    })
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

module.exports = router;
