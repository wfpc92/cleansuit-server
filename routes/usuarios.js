var express = require('express');
var router = express.Router();
var Usuarios   = require('../models/usuarios');
var Clientes = require('../models/clientes');
router.get('/', function(req, res, next) {
	res.render('index', { view: 'pages/home'});
});

router.post('/registrar', function(req, res) {
	if (!req.body.nombre || !req.body.correo || !req.body.contrasena) {
		res.json({success: false, mensaje: 'Por favor ingrese nombre, correo y contraseña.'});
	} else {
		//informacion de autenticacion de usuario
		var nuevoUsuario = new Usuarios({
			nombre: req.body.nombre,
			correo: req.body.correo,
			contrasena: req.body.contrasena,
			rol: 'cliente'
		});

		// save the usuario
		nuevoUsuario.save(function(err) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			
			//informacion de cliente
			var infoCliente = new Clientes({
				usuario_id: nuevoUsuario._id,
				direccion: '',
				telefono:''
			});

			infoCliente.save(function(err){
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				res.json({
					success: true, 
					usuario: nuevoUsuario.getInfo(infoCliente),
					mensaje: 'usuario creado satisfactoriamente.'
				});
			});
		});
	}
});

router.post('/ingresar', function(req, res, next) {
		console.log("POST /ingresar, validacion de datos: ", req.body);
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
		if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

		if (!usuario) {
			res.json({success: false, mensaje: 'Usuario no encontrado.', error: err});
		} else {
			usuario.comparePassword(req.body.contrasena, function (err, isMatch) {
				if (isMatch && !err) {
					//informacion de cliente
					Clientes.findOne({
						usuario_id: usuario._id
					}, function(err, infoCliente) {
						if (err) return res.json({success: false, mensaje: err});

						res.json({
							success: true, 
							usuario: usuario.getInfo(infoCliente),
							mensaje: 'usuario logueado satisfactoriamente.'
						});
					});
				} else {
					return res.json({success: false, mensaje: 'Contraseña incorrecta.', error: err});
				}
			});
		}
	});
});


/* Inicia la sesión de usuario usando su información de facebook
 * Recibe fb_token y fb_uid obtenidos previamente en el cliente
 * Valida que los datos sean correctos consultando con el API de fb si el token corresponde al uid
 * Si es válido, retorna el token de sesión
 */
router.post("/ingresar/fb", function(req, res, next) {
	console.log("POST /ingresar/fb, validacion de datos: ", req.body);
	
	// obtenemos el token y el uid de la solicitud
	var fb_token = "", fb_uid = "";
	if (req.body.fb_token && req.body.fb_uid) {
		if (req.body.fb_token.length > 0 && req.body.fb_uid.length > 0) {
			fb_token = req.body.fb_token;
			fb_uid = req.body.fb_uid;
		}
	}
	if (fb_token == "" && fb_uid == "") {
		res.json({ success: false, mensaje: 'Datos insuficientes para iniciar sesión.' });
		return;
	}

	
	// Validamos con Facebook que el token y el uid son verdaderos

	// Si son verdaderos, buscamos un usuario que tenga este fb_uid en su perfil

	// Si el usuario existe, le generamos un token y retornamos el usual token de sesión

	// Si el usuario no existe, lo creamos (sin contraseña, pero con el fb_uid) y retornamos el usual token de sesión

});


 
/*getToken = function (headers) {
	console.log("get otken")
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
};*/

module.exports = function(app, passport) {

	router.get('/usuarios', passport.authenticate('jwt', { session: false}), function(req, res) {
		Usuarios.find(function(err, usuarios) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json(usuarios);
		});
	});

	router.get('/cliente', passport.authenticate('jwt', { session: false}), function(req, res) {
		Clientes.findOne({
			usuario_id: req.user._id
		}, function(err, infoCliente) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			// return the information including token as JSON
			res.json({
				success: true, 
				usuario: req.user.getInfo(infoCliente),
				mensaje: 'informacion de usuario.'
			});
		});
	});

	router.post('/cliente', passport.authenticate('jwt', { session: false}), function(req, res) {
		console.log(JSON.stringify(req.user))
		console.log(JSON.stringify(req.body))
		
		var mensaje = "";
		req.user.nombre = req.body.nombre;
		req.user.correo = req.body.correo;
		
		console.log(req.body.contrasena,  req.body.repetirContrasena)
		if(req.body.contrasena) {
			console.log("hola")
			if (req.body.contrasena == req.body.repetirContrasena){
				req.user.contrasena = req.body.contrasena;
				mensaje = "Contraseña Modificada.";
			} else {
				return res.json({success: false, mensaje: "contraseñas no coinciden."});
			}
		}

		req.user.save(function(err){
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			Clientes.findOne({
				usuario_id: req.user._id
			}, function(err, infoCliente) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				infoCliente.direccion = req.body.direccion;
				infoCliente.telefono = req.body.telefono;
				infoCliente.url_foto = req.body.data_foto || infoCliente.url_foto;

				infoCliente.save(function(err){
					if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

					res.json({
						success: true, 
						usuario: req.user.getInfo(infoCliente),
						mensaje: 'informacion actualizada' + (mensaje ? " y " : "") + mensaje
					});
				});
				
			});		
		});
	});



	return router;
};
