var express = require('express');
var router = express.Router();

var Ordenes = require('../models/ordenes');


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
			next();
		} catch(err) {
			return next(err);
		}
	},	function(req, res){
		var orden = new Ordenes();
		orden.cliente_id = req.user._id; //con passport obtenemos req.user a partir del token
		orden.fecha = new Date();
		orden.estado = 'nueva';
		//datos validado
		orden.orden = req.orden;
		orden.items = req.items;
		
		orden.save(function(err) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				mensaje: 'orden enviada.',
				orden: orden
			});
		});
	});


	router.get('/en-proceso', function(req, res) {
		Ordenes
			.find({'cliente_id': req.user._id})
			.where('estado').in(['nueva', 'rutaRecoleccion', 'recolectada', 'procesando', 'rutaEntrega'])
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

	return router;
};
