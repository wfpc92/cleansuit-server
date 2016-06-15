var express = require('express');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var router = express.Router();
var config = require('../config'); // get our config file
var User   = require('../models/user'); // get our mongoose model

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({name: req.body.name}, function(err, user) {
		if (err) throw err;

		if (!user) {
		  res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

		  // check if password matches
		  if (user.password != req.body.password) {
			res.json({ success: false, message: 'Authentication failed. Wrong password.' });
		  } else {

			// if user is found and password is right
			// create a token
			var token = jwt.sign(user, config.secret, {
				expiresIn: "24h" // expires in 24 hours
			});

			// return the information including token as JSON
			res.json({
			  success: true,
			  message: 'Enjoy your token!',
			  token: token
			});
		  }   
		}
	});
});

//middleware: verificar token de autenticacion.
router.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {      
		  if (err) {
			return res.json({ success: false, message: 'Failed to authenticate token.' });    
		  } else {
			// if everything is good, save to request for use in other routes
			req.decoded = decoded;    
			next();
		  }
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).json({ 
			success: false, 
			message: 'No token provided.' 
		});
	
	}
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log(req.decoded)
  res.send('respond with a resource');
});

router.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({ 
		name: 'Nick Cerminara', 
		password: 'password',
		admin: true 
	});

	// save the sample user
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/all', function(req, res) {
	console.log(req.decoded)
	User.find({}, function(err, users) {
		if (err) throw err;

		res.json(users);
	});
});

module.exports = function(app) {
	router.app = app;
	return router;
}


