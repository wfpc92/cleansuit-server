var express = require('express');
var https = require("https");
var crypto = require("crypto");
var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');
var ejs = require("ejs");
var fs = require("fs");
var url = require('url');

var Usuarios = require('../models/usuarios');
var Clientes = require('../models/clientes');

var router = express.Router();

var estadoReset = {
	FORMULARIO: "FORMULARIO",
	CADUCADO: "CADUCADO",
	RESET_OK: "RESET_OK",
	ERROR_SERVIDOR: "ERROR_SERVIDOR"
};

// @HELPER Envía un correo automatizado con el texto
// Invoca el callback al terminar con error=null en caso de éxito
// El correo se envía mediante el SendMail de WebFaction (https://docs.webfaction.com/user-guide/email.html#email-sending-from-an-application)
function enviarEmail(origen, destino, titulo, texto, html, callback) {
	var opciones = {
		"from": origen,
		"to": destino,
		"subject": titulo,
		"text": texto,
		"html": html
	};
	var transporter = nodemailer.createTransport(sendmailTransport({ "path": "/usr/bin/sendmail", "args": "" }));
	transporter.sendMail(opciones, function(error, info) {
		callback(error, info);
	});
}

// Registra un nuevo usuario en BD
// invoca callback al terminar con la info del usuario creado como parámetro
function registrarCliente(datos, callback) {
	var nuevoUsuario = new Usuarios({
		"nombre": datos.nombre,
		"correo": datos.correo,
		"contrasena": datos.contrasena,
		"rol": 'cliente',
		"facebook": (datos.fb_uid) ? datos.fb_uid : '',
		"profile": {
			direccion: '',
			telefono: '',
			url_foto: datos.url_foto
		}
	});

	nuevoUsuario.save(function(err) {
		if (err) { console.log(err); callback(null); return;}

		callback(nuevoUsuario.getInfo());
	});
}

router.get('/', function(req, res, next) {
	res.render('index', { view: 'pages/home'});
});

router.post('/registrar', function(req, res) {
	var datos = req.body.datos || {};

	if (!datos.nombre || !datos.correo || !datos.contrasena) {
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
			req.correo = req.body.correo.toLowerCase();
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
					res.json({
						success: true,
						usuario: usuario.getInfo(),
						mensaje: 'usuario logueado satisfactoriamente.'
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
	if (!fb_token && !fb_uid) {
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
					Usuarios.findOne({ "facebook": fb_uid }, function(err, usuario) {
						if (err) return res.json({ success: false, mensaje: err.errmsg, error: err });

						// Si el usuario existe, retornamos el token
						if (usuario) {
							res.json({
								success: true,
								existe: true,
								usuario: usuario.getInfo(),
								mensaje: 'usuario logueado satisfactoriamente.'
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
								"facebook": fb_uid
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

/* Envía al correo del cliente un enlace único que le permite restaurar su contraseña
 * El enlace caduca en 24 horas
 */
router.post('/cliente/reset', function(req, res) {
	var correo = (req.body.correo) ? (req.body.correo).trim() : "";

	if (correo == "") {
		res.json({ success: false, mensaje: 'Datos insuficientes para recuperar contraseña.' });
		return;
	}

	Usuarios.findOne({ "correo": correo }, function(err, usuario) {
		if (err) return res.json({ success: false, mensaje: err.errmsg, error: err });

		if (!usuario) {
			return res.json({ success: false, mensaje: 'El correo ingresado no corresponde a una cuenta registrada.' });
		}

		// generamos enlace único de restaurar contraseña, que expire en 24 horas
		var cadenaRandom = (crypto.randomBytes(24)).toString("base64");
		var passToken = cadenaRandom.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
		var enlaceReset = "http://api.cleansuit.co/cliente/reset/" + passToken;

		// almacenamos en BD el token y fecha de expiración
		usuario.pass_token = passToken;
        usuario.pass_token_vence = Date.now() + 3600000 * 24; // en 24 horas vence

        usuario.save(function(err) {
        	if (err) return res.json({ success: false, mensaje: "Se ha producido un error al intentar almacenar esta información.", error: err });

			// enviamos correo electrónico con el enlace
			var asunto = "Cleansuit: Restaurar su contraseña";
			var texto = "Para restaurar su contraseña, ingrese en el enlace: " + enlaceReset;

			fs.readFile('views/correo_reset.ejs', 'utf-8', function(err, content) {
				var renderedHtml = ejs.render(content, {
					enlaceReset: enlaceReset,
					resetSuccess: false
				});

				enviarEmail("noreply@cleansuit.co", correo, asunto, texto, renderedHtml, function(email_error, email_info) {
					var success = true;
					var mensaje = "Se ha enviado un enlace a tu correo.";

					if (email_error) {
						success = false;
						mensaje = "Estamos experimentado problemas con nuestros servidores. Por favor, intenta más tarde.";
					}

					return res.json({
						success: success,
						mensaje: mensaje,
						pass_token: passToken//quitar esto, solo para pruebas.
					});
				});
			});

        });
	});
});


/* Recibe un token de recuperación de contraseña
 * Si es válido, envía un correo con la nueva contraseña
*/
router.get('/cliente/reset/:token', function(req, res) {
	var pass_token = req.params.token;
	var baseUrl = url.format({protocol: req.protocol, host: req.get('host')});
	var action = url.format({protocol: req.protocol, host: req.get('host'), pathname: req.originalUrl});

	// Buscamos el usuario con este token de recuperación de contraseña
	Usuarios.findOne({ "pass_token": pass_token }, function(err, usuario) {
		if (!usuario) {
			return res.render("reset", {
				estado: estadoReset.CADUCADO,
				baseUrl: baseUrl
			});
		}

		// Verificamos que el token no ha expirado
		var vencimiento = usuario.pass_token_vence;
		if (Date.now() > vencimiento) {
			return res.render("reset", {
				estado: estadoReset.CADUCADO,
				baseUrl: baseUrl
			});
		}

		return res.render("reset", {
			estado: estadoReset.FORMULARIO,
			action: action,
			baseUrl: baseUrl
		});
	});
});

router.post('/cliente/reset/:token', function(req, res) {
	var pass_token = req.params.token || "";
	var contrasena = req.body.contrasena || "";
	var confirmarContrasena = req.body.confirmarContrasena || "";
	var baseUrl = url.format({protocol: req.protocol, host: req.get('host')});
	var action = url.format({protocol: req.protocol, host: req.get('host'), pathname: req.originalUrl});


	if (contrasena !== confirmarContrasena || contrasena.length < 6) {
		return res.render("reset", {
			estado: estadoReset.FORMULARIO,
			errContrasena: true,
			action: action,
			baseUrl: baseUrl
		});
	}

	// Buscamos el usuario con este token de recuperación de contraseña
	Usuarios.findOne({ "pass_token": pass_token }, function(err, usuario) {
		if (!usuario) {
			return res.render("reset", {
				estado: estadoReset.CADUCADO,
				baseUrl: baseUrl
			});
		}

		// Verificamos que el token no ha expirado
		var vencimiento = usuario.pass_token_vence;
		if (Date.now() > vencimiento) {
			return res.render("reset", {
				estado: estadoReset.CADUCADO,
				baseUrl: baseUrl
			});
		}

		usuario.contrasena = contrasena;
		usuario.pass_token = "";

		usuario.save(function(err) {
			if (err) {
				return res.render("reset", {
					estado: estadoReset.FORMULARIO,
					errContrasena: true,
					action: action,
					baseUrl: baseUrl
				});
			}

			// Enviamos el correo con la nueva contraseña
			var asunto = "Cleansuit: Su contraseña ha sido restaurada exitosamente!";
			var texto = "Su contraseña ha sido restaurada!";
			var correo = usuario.correo;

			fs.readFile('views/correo_reset.ejs', 'utf-8', function(err, content) {
				var renderedHtml = ejs.render(content, {
					enlaceReset: "",
					resetSuccess: true
				});

				enviarEmail("noreply@cleansuit.co", correo, asunto, texto, renderedHtml, function(email_error, email_info) {
					if (email_error) {
						return res.render("reset", {
							estado: estadoReset.ERROR_SERVIDOR,
							baseUrl: baseUrl
						});
					}

					return res.render("reset", {
						estado: estadoReset.RESET_OK,
						baseUrl: baseUrl
					});
				});
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

	router.post('/usuarios', passport.authenticate('jwt', { session: false}), function(req, res) {
		var usuario = new Usuarios({
			nombre: req.body.nombre || "",
			correo: req.body.correo || "",
			rol: req.body.rol || "",
			contrasena: req.body.correo || ""
		});

		usuario.save(function(err) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				usuario: usuario,
				mensaje: 'usuario nuevo de la plataforma'
			});
		});
	});

	router.put('/usuarios/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
		Usuarios.findById(req.params.id, function(err, usuario) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			usuario.nombre = req.body.nombre || usuario.nombre;
			usuario.correo = req.body.correo || usuario.correo;
			usuario.rol = req.body.rol || usuario.rol;

			if(req.body.reiniciarContrasena) {
				usuario.contrasena = usuario.correo;
			}

			usuario.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				res.json({
					success: true,
					usuario: usuario,
					mensaje: 'usuario actualizado en la plataforma'
				});
			});
		});
	});

	router.get('/usuarios/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
		Usuarios.findById(req.params.id, function(err, usuario) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				usuario: usuario,
				mensaje: 'informacion de usuario'
			});
		});
	});

	router.delete('/usuarios/:id', function(req, res){
		Usuarios.findByIdAndRemove(req.params.id, function(err, usuario) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				usuario: usuario,
				mensaje: 'usuario eliminado'
			});
		});
	});

	router.get('/cliente', passport.authenticate('jwt', { session: false}), function(req, res) {
		Usuarios.findOne({
			_id: req.user._id
		}, function(err, user) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			// return the information including token as JSON
			res.json({
				success: true,
				usuario: user.getInfo(),
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
		req.user.profile = {
			direccion: req.body.direccion || "",
			telefono: req.body.telefono || "",
			url_foto: req.body.url_foto || ""
		};

		if(req.body.contrasena) {
			if (req.body.contrasena == req.body.repetirContrasena){
				req.user.contrasena = req.body.contrasena;
				mensaje = "Contraseña Modificada.";
			} else {
				return res.json({success: false, mensaje: "contraseñas no coinciden."});
			}
		}

		req.user.save(function(err){
			if (err) return res.json({success: false, mensaje: "Información duplicada.", error: err});

			res.json({
				success: true,
				usuario: req.user.getInfo(),
				mensaje: 'informacion actualizada' + (mensaje ? " y " : "") + mensaje
			});
		});
	});

	router.get('/roles', passport.authenticate('jwt', { session: false}), function(req, res) {
		res.json({
			success: true,
			roles: Usuarios.ROLES,
			mensaje: 'roles de la plataforma'
		});
	});

	return router;
};
