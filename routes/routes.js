var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Entity = require('../models/entity');
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

router.get('/addEntity', function (req, res, next) {
	var response = {
		status_code : 0,
        status_message : "success",
        data : false
	};
	var obj = {
		location: req.query.location,
		name: req.query.name,
		long: null,
		lat: null,
		femaleProc: req.query.femper,
		imageUrl: req.query.imagelink,
		address: req.query.address,
		description: req.query.description,
		//TODO
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
	    console.log(JSON.parse(data));
	    res.json(response);
	    //TODO insert in DB
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

module.exports = router;
