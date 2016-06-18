var express = require('express');
var jwt         = require('jwt-simple');
var router = express.Router();
var User   = require('../models/user'); // get our mongoose model
var config = require("../config/passport")

router.get('/', function(req, res, next) {
	res.render('index', { view: 'pages/home'});
});

router.post('/signup', function(req, res) {
	if (!req.body.name || !req.body.email || !req.body.password) {
		res.json({success: false, mensaje: 'Por favor ingrese nombre, email y contraseña.'});
	} else {
		var newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});
		// save the user
		newUser.save(function(err) {
			if (err) {
				return res.json({success: false, mensaje: err});
			}
			var token = jwt.encode(newUser, config.jwtSecret);
			// return the information including token as JSON
			res.json({success: true, token: 'JWT ' + token , mensaje: 'usuario creado satisfactoriamente.'});
		});
	}
});

router.post('/authenticate', function(req, res) {
	User.findOne({
			email: req.body.email
		}, function(err, user) {
		if (err) return res.send(err);

		if (!user) {
			res.send({success: false, mensaje: 'Falló autenticación. Usuario no encontrado.'});
		} else {
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (isMatch && !err) {
					// if user is found and password is right create a token
					var token = jwt.encode(user, config.jwtSecret);
					// return the information including token as JSON
					res.json({success: true, token: 'JWT ' + token});
				} else {
					res.send({success: false, mensaje: 'Falló autenticación. Contraseña incorrecta.'});
				}
			});
		}
	});
});
 
getToken = function (headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

	router.get('/users', function(req, res) {
		User.find(function(err, usuarios) {
			if (err) res.send(err);

			res.json(usuarios);
		});
	});

	router.get('/memberinfo', function(req, res) {
		var token = getToken(req.headers);
		if (token) {
			var decoded = jwt.decode(token, config.jwtSecret);
			User.findOne({
				name: decoded.name
			}, function(err, user) {
				if (err) throw err;

				if (!user) {
					return res.status(403).send({success: false, mensaje: 'Falló autenticación. Usuario no encontrado.'});
				} else {
					res.json({success: true, mensaje: 'Welcome in the member area ' + user.name + '!'});
				}
			});
		} else {
			return res.status(403).send({success: false, mensaje: 'No se envió token.'});
		}
	});

	return router;
}


