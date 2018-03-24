var express = require('express');
var router = express.Router();
var User = require('../models/user');

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
				console.log(err);
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
})

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

module.exports = router;
