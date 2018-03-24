var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.render('login');
});

router.post('/', function (req, res, next) {
	if (req.body.logemail && req.body.logpassword) {
		User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password.');
		        err.status = 401;
		        return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('index');
			}
		})
	}
})

router.get('/register', function (req, res, next) {
	res.render('register');
});	

router.post('/register', function (req, res, next) {
	if (req.body.password !== req.body.passwordConf) {
		var err = new Error('Passwords do not match.');
	    err.status = 400;
	    res.send("passwords dont match");
	    return next(err);
	}

	if (req.body.email &&
		req.body.name &&
		req.body.password &&
		req.body.passwordConf) {
		console.log("here");
		var userData = {
			email: req.body.email,
			name: req.body.name,
			password: req.body.password,
			administrator: false
		}

		User.create(userData, function (err, user) {
			if (err) {
				console.log(err);
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('index');
			}
		})
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
