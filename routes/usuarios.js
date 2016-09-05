var express = require('express');
var https = require("https");
var crypto = require("crypto");
var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

var Usuarios = require('../models/usuarios');
var Clientes = require('../models/clientes');

var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', { view: 'pages/home'});
});

// @HELPER Envía un email automatizado con el texto
// Invoca el callback al terminar con error=null en caso de éxito
// El email se envía mediante el SendMail de WebFaction (https://docs.webfaction.com/user-guide/email.html#email-sending-from-an-application)
function enviarEmail(origen, destino, titulo, texto, callback) {
	var opciones = {
		"from": origen,
		"to": destino,
		"subject": titulo,
		"text": texto
	};
	var transporter = nodemailer.createTransport(sendmailTransport({ "path": "/usr/bin/sendmail", "args": "" }));
	transporter.sendMail(opciones, function(error, info) {
		callback(error, info);
	});
}

// Registra un nuevo usuario cliente en BD (almacena 2 registros 1:1 en usuarios y clientes)
// invoca callback al terminar con la info del usuario creado como parámetro
function registrarCliente(datos, callback) {
	var nuevoUsuario = new Usuarios({
		"nombre": datos.nombre,
		"correo": datos.correo,
		"contrasena": datos.contrasena,
		"rol": 'cliente',
		"fb_uid": (datos.fb_uid) ? datos.fb_uid : ''
	});

	nuevoUsuario.save(function(err) { 
		if (err) { console.log(err); callback(null); return;} 
		
		//informacion de cliente
		var infoCliente = new Clientes({
			usuario_id: nuevoUsuario._id,
			direccion: '',
			telefono: '',
			url_foto: datos.url_foto
		});

		infoCliente.save(function(err) {
			if (err) { console.log(err); callback(null); } 
			var info = nuevoUsuario.getInfo(infoCliente);
			callback(info);
		});
	});
}

router.post('/registrar', function(req, res) {
	if (!req.body.nombre || !req.body.correo || !req.body.contrasena) {
		res.json({success: false, mensaje: 'Por favor ingrese nombre, correo y contraseña.'});
	}
	else {
		registrarCliente(req.body, function(infoUsuario) {
			if (infoUsuario) {
				res.json({
					success: true, 
					usuario: infoUsuario,
					mensaje: 'Usuario creado satisfactoriamente.'
				});
			}
			else {
				res.json({ success: false, mensaje: "No se pudo registrar el usuario." });
			}
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
 * Si es válido, retorna el usuario con token de sesión
 */
router.post("/ingresar/fb", function(req, res, next) {
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
	console.log("fb_token:", fb_token)
	var options = {
		host: "graph.facebook.com",
		path: "/v2.6/me?fields=id,email,last_name,first_name&access_token=" + fb_token
	};
	https.get(options, function(responseFb) {
		var data = "";
		
		responseFb.on('data', function(chunk) {
			data = chunk;
		});

		responseFb.on('end',function() {
			if (responseFb.statusCode > 220 || responseFb.statusCode < 200) {
				console.log("Error - FB respondió con status ", responseFb.statusCode);
				res.json({ success: false, mensaje: "No se pudo iniciar sesión con Facebook." });
				return;
			}

			var parsed = JSON.parse(data);
			// Continuar si se obtuvo respuesta válida de FB API
			if (parsed.id) {
				console.log("Respuesta de FB:", parsed.id, parsed.email, parsed.last_name, parsed.first_name);
				var fb_api_uid = parsed.id;
				// el UID de FB API coincide con el de la app cliente?
				if (fb_api_uid == fb_uid) {
					// El usuario ya tiene cuenta en Cleansuit?
					Usuarios.findOne({ "fb_uid": fb_uid }, function(err, usuario) {
						if (err) return res.json({ success: false, mensaje: err.errmsg, error: err });

						// Si el usuario existe, retornamos el token
						if (usuario) {
							Clientes.findOne({
								usuario_id: usuario._id
							}, function(err, infoCliente) {
								if (err) return res.json({success: false, mensaje: err});

								res.json({
									success: true, 
									existe: true,
									usuario: usuario.getInfo(infoCliente),
									mensaje: 'usuario logueado satisfactoriamente.'
								});
							});
						}
						else {
							// El usuario no existe -> crear uno nuevo y retornar token
							var nombre1 = "" + parsed.name;
							var nombre2 = (parsed.first_name + " " + parsed.last_name).trim();
							
							crypto.randomBytes(7, (err, buf) => {
								if (err) throw err;
							});

							var datosNuevoUsuario = {
								"nombre": (nombre1.length > nombre2.length) ? nombre1 : nombre2,
								"correo": parsed.email,
								"contrasena": (crypto.randomBytes(12)).toString("base64"),
								"url_foto": "http://graph.facebook.com/"+fb_uid+"/picture?width=270&height=270",
								"fb_uid": fb_uid
							}

							registrarCliente(datosNuevoUsuario, function(infoUsuario) {
								if (infoUsuario) {
									res.json({
										success: true, 
										existe: false,
										usuario: infoUsuario,
										mensaje: 'Nuevo usuario registrado con éxito.'
									});
									return;
								}
								else {
									console.log("falló registrarCliente(): ", infoUsuario);
									res.json({ success: false, mensaje: "No se pudo registrar el usuario. Si ya tiene cuenta en Cleansuit, por favor inicie sesión con sus credenciales." });
									return;
								}
							});
						}
					});
				}
				else {
					console.log("ERROR - el Token de FB no corresponde al id de usuario retornado por FB.");
					res.json({ success: false, mensaje: "No se pudo iniciar sesión con Facebook." });
					return;
				}
			}
			else {
				console.log("ERROR - FB no respondió con el id del usuario.");
				res.json({ success: false, mensaje: "No se pudo iniciar sesión con Facebook." });
				return;
			}
		});

		responseFb.on('error', function(err) {
			res.json({ "success": false, "mensaje": "Error: " + err.message });
		});
	});

	return;
});

/* Envía al email del cliente un enlace único que le permite restaurar su contraseña
 * El enlace caduca en 24 horas
 */
router.post('/cliente/reset', function(req, res) {
	var email = (req.body.email) ? (req.body.email).trim() : "";
	
	if (email == "") {
		res.json({ success: false, mensaje: 'Datos insuficientes para recuperar contraseña.' });
		return;
	}

	Usuarios.findOne({ "correo": email }, function(err, usuario) {
		if (err) return res.json({ success: false, mensaje: err.errmsg, error: err });

		if (!usuario) {
			return res.json({ success: false, mensaje: 'El email ingresado no corresponde a una cuenta registrada.' });
		}
		
		// generamos enlace único de restaurar contraseña, que expire en 24 horas
		var cadenaRandom = (crypto.randomBytes(24)).toString("base64");
		var passToken = cadenaRandom.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
		var enlaceReset = "http://api.cleansuit.co/cliente/reset/" + passToken;

		// almacenamos en BD el token y fecha de expiración
		usuario.pass_token = passToken;
        usuario.pass_token_vence = Date.now() + 3600000 * 24; // en 24 horas vence
        
        usuario.save(function(err) {
        	if (err) return res.json({ success: false, mensaje: err.errmsg, error: err });

			// enviamos email con el enlace
			var asunto = "Cleansuit: Restaurar su contraseña";
			var texto = "Para restaurar su contraseña, ingrese en el enlace: " + enlaceReset;
			enviarEmail("noreply@cleansuit.co", email, asunto, texto, function(email_error, email_info) {
				if (email_error) {
					return res.json({ success: false, mensaje: email_error });
				}

				return res.json({ success: true });
			});
        });
	});
});

/* Recibe un token de recuperación de contraseña
 * Si es válido, envía un email con la nueva contraseña
*/
router.get('/cliente/reset/:token', function(req, res) {
	var pass_token = req.params.token;
	// Buscamos el usuario con este token de recuperación de contraseña
	Usuarios.findOne({ "pass_token": pass_token }, function(err, usuario) {
		if (!usuario) {
			return res.json({ success: false, mensaje: 'El enlace de recuperar contraseña es inválido o ha caducado.' });
		}

		// Verificamos que el token no ha expirado
		var vencimiento = usuario.pass_token_vence;
		if (Date.now() > vencimiento) {
			return res.json({ success: false, mensaje: 'El enlace de recuperar contraseña es inválido o ha caducado.' });
		}

		// Reseteamos la contraseña y guardamos el usuario
		var cadenaRandom = (crypto.randomBytes(8)).toString("base64");
		var nuevaContrasena = cadenaRandom.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
		usuario.contrasena = nuevaContrasena;

		usuario.save(function(err) {
			if (err) return res.json({ success: false, mensaje: 'Ocurrió un error al intentar restaurar la contraseña.' });

			// Enviamos el email con la nueva contraseña
			var asunto = "Cleansuit: Su contraseña ha sido restaurada!";
			var texto = "Su nueva contraseña es: " + nuevaContrasena;
			var email = usuario.correo;
			enviarEmail("noreply@cleansuit.co", email, asunto, texto, function(email_error, email_info) {
				if (email_error) {
					return res.json({ success: false, mensaje: email_error });
				}
				
				return res.json({ success: true });
			});
		});
	});
});

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
		//console.log(JSON.stringify(req.user))
		//console.log(JSON.stringify(req.body))
		
		var mensaje = "";
		req.user.nombre = req.body.nombre || "";
		req.user.correo = req.body.correo || "";
		
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
			if (err) return res.json({success: false, mensaje: "Información duplicada.", error: err});

			Clientes.findOne({
				usuario_id: req.user._id
			}, function(err, infoCliente) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				//console.log(JSON.stringify(infoCliente))
				infoCliente.direccion = req.body.direccion || "";
				infoCliente.telefono = req.body.telefono || "";
				infoCliente.url_foto = req.body.url_foto || infoCliente.url_foto;

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
