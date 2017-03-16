var express = require('express');
var router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		// console.log(file)
		callback(null, "./public/updates");
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname);
	}
});
var upload = multer({ storage : storage});

var mongoose = require('mongoose');
var Usuarios = mongoose.model('Usuarios');
var Ordenes = mongoose.model('Ordenes');
var VersionesOrdenes = mongoose.model('VersionesOrdenes');

var validarRolDomiciliario = function(req, res, next) {
    if (req.user.rol == 'domiciliario') {
    	next();
    } else {
    	next().json({
			success: false,
			mensaje: "Rol no autorizado"
		});
    }
};

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

	// middleware to use for all requests
	// router.use(function(req, res, next) {
	//     // do logging
	//     console.log('Something is happening.');
	//     next(); // make sure we go to the next routes and don't stop here
	// });

	router.get('/', function(req, res) {
		Ordenes
		.find()
		.populate('cliente_id')
		.exec(function(err, ordenes) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				ordenes: ordenes,
				mensaje: "lista de ordenes de domicilio."
			});
		});
	});


	router.post('/', function(req, res, next) {
		console.log("POST /ordenes, validacion de datos: ", req.body);
		try {
			req.orden = req.body.orden;
			req.items = req.body.items;
			req.cupon = req.body.cupon;
			next();
		} catch(err) {
			return next(err);
		}
	},	function(req, res){
		var orden = new Ordenes();
		orden.cliente_id = req.user._id; //con passport obtenemos req.user a partir del token
		orden.fecha = new Date();
		orden.estado = Ordenes.ESTADOS[0];
		//datos validado
		orden.orden = req.orden;
		orden.items = req.items;
		orden.cupon = req.cupon;

		orden.save(function(err) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			VersionesOrdenes.actualizar(req.user._id, function(o) {
				res.json({
					success: true,
					mensaje: 'orden enviada.',
					orden: orden
				});
			});
		});
	});

	router.put('/:id', function(req, res){

		var aObjeto = function(txt) {
			// console.log(typeof txt, txt)
			if (typeof txt != 'object') {
				try {
					return JSON.parse(txt);
				} catch (e) {
					console.error("error: ", txt);
					return undefined;
				}
				return ;
			}
			return txt;
		};

		// console.log("body: ", req.body)
		upload.any()(req, res, function(err) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			Ordenes.findById(req.params.id)
			.populate('cliente_id')
			.exec(function(err, orden) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				console.log("orden recuperada: ", orden);
				console.log("body: ", req.body);
				orden.orden = req.body.orden ? aObjeto(req.body.orden) : orden.orden;
				orden.recoleccion = req.body.recoleccion ? aObjeto(req.body.recoleccion) : orden.recoleccion;
				//aqui se hace la simulacion de que la entrega es igual que la recoleccion.
				orden.entrega = req.body.recoleccion ? aObjeto(req.body.recoleccion) : orden.entrega;
				console.log("estado", orden.estado);
				orden.estado = req.body.estado ? Ordenes.ESTADOS[req.body.estado] : orden.estado;
				console.log("estado", req.body.estado, orden.estado);

				if (req.body.domiciliario_recoleccion_id) {
					if (orden.domiciliario_recoleccion_id != req.body.domiciliario_recoleccion_id._id && typeof req.body.domiciliario_recoleccion_id._id != 'undefined') {
						orden.domiciliario_recoleccion_id = req.body.domiciliario_recoleccion_id._id;
						orden.estado = Ordenes.ESTADOS[1];//cambiar estado en recoleccion.
					}
				}

				if (req.body.domiciliario_entrega_id) {
					if (orden.domiciliario_entrega_id != req.body.domiciliario_entrega_id._id && typeof req.body.domiciliario_entrega_id._id != 'undefined') {
						orden.domiciliario_entrega_id = req.body.domiciliario_entrega_id._id;
						orden.estado = Ordenes.ESTADOS[4];//cambiar estado en entrega.
					}
				}

				// Save the beer and check for errors
				orden.save(function(err) {
					if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

					res.json({
						success: true,
						orden: orden,
						mensaje: 'orden modificada'
					});
				});

			});

		});
	});


	router.get('/en-proceso', function(req, res) {
		Ordenes
		.find({'cliente_id': req.user._id})
		.where('estado').in(Ordenes.ESTADOSENPROCESO)
		.populate('cliente_id')
		.exec(function(err, ordenes) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				ordenes: ordenes,
				mensaje: "lista de ordenes de domicilio en proceso."
			});
		});
	});


	router.get('/historial', function(req, res) {
		Ordenes
		.find({'cliente_id': req.user._id})
		.where('estado').in(['entregada', 'cancelada'])
		.populate('cliente_id')
		.exec(function(err, ordenes) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				ordenes: ordenes,
				mensaje: "lista de ordenes de domicilio procesadas y/o canceladas."
			});
		});
	});


	router.get('/asignadas', validarRolDomiciliario, function(req, res) {

		var ordenesRespuesta = [];

		var getOrdenes = function(find, estado, index, cb) {
			Ordenes
			.find(find)
			.where('estado').in(estado)
			.populate('cliente_id')
			.exec(function(err, ordenes) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				ordenesRespuesta[index] = ordenes;

				if (cb) {
					cb();
				}
			});
		};

		getOrdenes({domiciliario_recoleccion_id: req.user._id}, Ordenes.ESTADORUTARECOLECCION, 0, function() {
			getOrdenes({domiciliario_recoleccion_id: req.user._id}, Ordenes.ESTADORECOLECTADA, 1, function() {
				getOrdenes({domiciliario_entrega_id: req.user._id}, Ordenes.ESTADORUTAENTREGA, 2, function() {
					getOrdenes({domiciliario_entrega_id: req.user._id}, Ordenes.ESTADOENTREGADA, 3, function() {
						res.json({
							success: true,
							ordenesRecoleccion: ordenesRespuesta[0],
							ordenesRecolectadas: ordenesRespuesta[1],
							ordenesEntrega: ordenesRespuesta[2],
							ordenesEntregadas: ordenesRespuesta[3],
							mensaje: "Ordenes asociadas a domiciliario. Ordenes por recolectar, recolectadas, para entregar y entregadas."
						});
					});
				});
			});
		});
	});

	/*router.post('/recolectada', validarRolDomiciliario,  function(req, res){
		console.log(req.body);
		res.json({
			success: true,
			mensaje: 'orden recolectada'
		});

		var orden = req.body.orden_id;
		var motivo = req.body.motivo;

		Ordenes.findById(orden_id)
		.populate('cliente_id')
		.exec(function(err, orden) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			orden.estado = Ordenes.ESTADOS[6];
			orden.cancelacion = orden.cancelacion || {};
			orden.cancelacion.motivo = motivo;

			orden.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});


			});
		});
	});*/

	router.post('/cancelar', validarRolDomiciliario,  function(req, res){
		var orden_id = req.body.orden_id;
		var motivo = req.body.motivo;

		Ordenes.findById(orden_id)
		.populate('cliente_id')
		.exec(function(err, orden) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			orden.estado = Ordenes.ESTADOS[6];
			orden.cancelacion = {
				motivo:	motivo
			};

			orden.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				res.json({
					success: true,
					orden: orden,
					mensaje: 'orden cancelada'
				});
			});
		});
	});

	router.post('/venta-directa', validarRolDomiciliario,  function(req, res) {
		var infoCliente = new Usuarios();

		if (!req.body.cliente_id._id) {
			req.body.cliente_id._id = infoCliente._id;
		}

		Usuarios.findById(req.body.cliente_id._id, function(err, infoCliente) {
			if (err) return res.json({success: false, mensaje: err});

			if (!infoCliente) {
				infoCliente = new Usuarios();
				infoCliente.nombre = req.body.cliente_id.nombre;
				infoCliente.correo = "x@x"+(new Date()).getTime();
				infoCliente.contrasena = infoCliente.correo;
				infoCliente.rol = 'cliente';
			}

			infoCliente.save(function(err) {
				var cont = 0;
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				var orden = new Ordenes();

				if (!req.body._id) {
					req.body._id = orden._id;
				}

				Ordenes.findById(req.body._id, function(err, orden) {
					if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

					if (!orden) {
						orden = new Ordenes();
						orden.cliente_id = infoCliente._id;
						orden.fecha = new Date();

						orden.domiciliario_entrega_id = req.user._id;
					}

					orden.orden = req.body.orden;
					orden.estado = Ordenes.ESTADOS[5];
					orden.recoleccion = req.body.recoleccion;

					orden.save(function(err) {
						if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

						res.json({
							success: true,
							orden: orden,
							mensaje: 'venta directa de producto enviada.'
						});
					});
				});
			});
		});
	});

	return router;
};
