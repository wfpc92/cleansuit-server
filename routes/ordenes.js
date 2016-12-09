var express = require('express');
var router = express.Router();

var Ordenes = require('../models/ordenes');
var Usuarios = require('../models/usuarios');

var VersionesOrdenes = require("../models/versiones-ordenes")


module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));
	
	// middleware to use for all requests
	router.use(function(req, res, next) {
	    // do logging
	    console.log('Something is happening.');
	    next(); // make sure we go to the next routes and don't stop here
	});

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
		Ordenes.findById(req.params.id)
		.populate('cliente_id')
		.exec(function(err, orden) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			
			if(orden.domiciliario_recoleccion_id != req.body.domiciliario_recoleccion_id._id) {
				orden.estado = Ordenes.ESTADOS[1];//cambiar estado en recoleccion.	
			}

			if(orden.domiciliario_entrega_id != req.body.domiciliario_entrega_id._id) {
				orden.estado = Ordenes.ESTADOS[4];//cambiar estado en entrega.	
			}

			//modificar atributos de la orden
			orden.domiciliario_recoleccion_id = req.body.domiciliario_recoleccion_id || orden.domiciliario_recoleccion_id;
			orden.domiciliario_entrega_id = req.body.domiciliario_entrega_id || orden.domiciliario_entrega_id;
			
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


	router.get('/asignadas', function(req, res, next) {
	    console.log(req.user.rol, Usuarios.ROLES[4])
	    	
	    if(req.user.rol == Usuarios.ROLES[4]) {
	    	next();
	    } else {
	    	next().json({
				success: false,
				mensaje: "Rol no autorizado"
			});
	    }
	}, function(req, res) {
		Ordenes
		.find({domiciliario_recoleccion_id: req.user._id})
		.where('estado').in(Ordenes.ESTADORUTARECOLECCION)
		.populate('cliente_id')
		.exec(function(err, ordenesRecoleccion) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			
			Ordenes
			.find({domiciliario_entrega_id: req.user._id})
			.where('estado').in(Ordenes.ESTADORUTAENTREGA)
			.populate('cliente_id')
			.exec(function(err, ordenesEntrega) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				
				res.json({
					success: true,
					ordenesRecoleccion: ordenesRecoleccion,
					ordenesEntrega: ordenesEntrega,
					mensaje: "lista de ordenes de domicilio en ruta de recoleccion y entrega."
				});
			});
		});
	});

	return router;
};
