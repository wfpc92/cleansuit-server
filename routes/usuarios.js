var express = require('express');
var jwt         = require('jwt-simple');
var router = express.Router();
var Usuarios   = require('../models/usuarios'); // get our mongoose model
var config = require("../config/passport")

router.get('/', function(req, res, next) {
	res.render('index', { view: 'pages/home'});
});

router.post('/registro', function(req, res, next) {
		console.log("POST /registro, validacion de datos: ", req.body);
		try {
			req.nombre = req.body.nombre;
			req.correo = req.body.correo;
			req.contrasena = req.body.contrasena;
			next();
		} catch(err) {
			return next(err);
		}
	},
	function(req, res) {
	if (!req.body.nombre || !req.body.correo || !req.body.contrasena) {
		res.json({success: false, mensaje: 'Por favor ingrese nombre, correo y contraseña.'});
	} else {
		var nuevoUsuario = new Usuarios({
			nombre: req.body.nombre,
			correo: req.body.correo,
			contrasena: req.body.contrasena,
			rol: 'cliente'			
		});
		// save the usuario
		nuevoUsuario.save(function(err) {
			if (err) {
				return res.json({success: false, mensaje: err});
			}
			var token = jwt.encode(nuevoUsuario._id, config.jwtSecret);
			// return the information including token as JSON
			res.json({
				success: true, 
				usuario: {
					nombre: nuevoUsuario.name, 
					correo: nuevoUsuario.email,
					rol: nuevoUsuario.rol,
					token: 'JWT ' + token
				},
				mensaje: 'usuario creado satisfactoriamente.'
			});
		});
	}
});

router.post('/autenticar', function(req, res, next) {
		console.log("POST /autenticar, validacion de datos: ", req.body);
		try {
			req.correo = req.body.correo;
			req.contrasena = req.body.contrasena;
			next();
		} catch(err) {
			return next(err);
		}
	}, function(req, res) {
	Usuarios.findOne({
			correo: req.correo
		}, function(err, usuario) {
		if (err) return res.send(err);

		if (!usuario) {
			res.send({success: false, mensaje: 'Falló autenticación. Usuario no encontrado.'});
		} else {
			usuario.comparePassword(req.body.contrasena, function (err, isMatch) {
				if (isMatch && !err) {
					// codificar id de usuario, el _id puede ser accedido en jwt_payload._id
					var token = jwt.encode({_id:usuario._id}, config.jwtSecret);
					// return the information including token as JSON
					res.json({
						success: true, 
						usuario: {
							nombre: usuario.nombre, 
							correo: usuario.correo,
							rol: usuario.rol,
							token: 'JWT ' + token
						},
						mensaje: 'usuario logueado satisfactoriamente.'
					});
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

	router.get('/usuarios', passport.authenticate('jwt', { session: false}), function(req, res) {
		Usuarios.find(function(err, usuarios) {
			if (err) res.send(err);

			res.json(usuarios);
		});
	});

	return router;
}


