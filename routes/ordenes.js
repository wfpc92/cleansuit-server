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
				if (err) return res.send(err);
				
				res.json(ordenes);
			});
	});


	router.post('/', function(req, res, next) {
		console.log("POST /orden, validacion de datos: ", req.body);
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
			if (err) return res.send(err);

			res.json({
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
				if (err) return res.send(err);
				
				res.json(ordenes);
			});
	});


	router.get('/historial', function(req, res) {
		Ordenes
			.find({'cliente_id': req.user._id})
			.where('estado').in(['entregada', 'cancelada'])
			.populate('cliente_id')
			.exec(function(err, ordenes) {
				if (err) return res.send(err);
				
				res.json(ordenes);
			});
	});

	return router;
};


/*
	router.get('/:idServicio', function(req, res) {
		Servicios.findById(req.params.idServicio, function(err, servicio) {
			if (err) res.send(err);

			res.json(servicio);
		});
	});

	router.put('/:idServicio', function(req, res){
		Servicios.findById(req.params.idServicio, function(err, servicio) {
			if (err) res.send(err);

			//modificar atributos del servicio
			servicio.nombre = req.body.nombre || servicio.nombre;
			servicio.descripcion = req.body.descripcion || servicio.descripcion;

			// Save the beer and check for errors
			servicio.save(function(err) {
				if (err) res.send(err);

				res.json(servicio);
			});
		});
	});

	router.delete('/:idServicio', function(req, res){
		Servicios.findByIdAndRemove(req.params.idServicio, function(err, servicio) {
			if (err) res.send(err);

			res.json(servicio);
		});
	});

	//subservicios:
	router.get('/:idServicio/subservicios', function(req, res) {
		Subservicios
			.find()
			.populate('_creator')
			.exec(function(err, subservicios) {
				if (err) res.send(err);
				
				res.json(subservicios);
			});
	});

	router.post('/:idServicio/subservicios', function(req, res) {
		Servicios.findById(req.params.idServicio, function(err, servicio) {
			if (err) return res.send(err);

			if(!servicio) return res.json(null);
			
			var subservicio = new Subservicios();
			subservicio._creator = servicio._id;
			subservicio.nombre = req.body.nombre;
			subservicio.descripcion = req.body.descripcion;
			subservicio.precio = req.body.precio;
			subservicio.detalles = req.body.detalles;

			subservicio.save(function(err) {
				if(err) res.send(err);

				servicio.subservicios.push(subservicio);
				servicio.save(function(err) {
					if(err) res.send(err);

					res.json({
						mensaje: "subservicio creado en el servicio: "+servicio._id,
						datos: servicio
					});
				});
			});        
		});
	});

	router.get('/subservicios/:idSubservicio', function(req, res){
		 Subservicios
			.findById(req.params.idSubservicio)
			.populate('_creator')
			.exec(function(err, subservicio) {
				if (err) res.send(err);
				
				res.json(subservicio);
			});
	});

	router.put('/subservicios/:idSubservicio', function(req, res){
		Subservicios.findById(req.params.idSubservicio, function(err, subservicio) {
			if (err) res.send(err);

			//modificar atributos del subservicio
			subservicio.nombre = req.body.nombre || subservicio.nombre;
			subservicio.descripcion = req.body.descripcion || subservicio.descripcion;
			subservicio.precio = req.body.precio || subservicio.precio;
			subservicio.detalles = req.body.detalles || subservicio.detalles;

			// Save the beer and check for errors
			subservicio.save(function(err) {
				if (err) res.send(err);

				res.json(subservicio);
			});
		});
	});

	router.delete('/subservicios/:idSubservicio', function(req, res){
		Subservicios.findByIdAndRemove(req.params.idSubservicio, function(err, subservicio) {
			if (err) res.send(err);

			if(subservicio) {
				Servicios.findById(subservicio._creator, function(err, servicio) {
					if(err) res.send(err);

					servicio.subservicios.pull({ _id: subservicio._id }); // removed
					servicio.save(function(err) {
						res.json(subservicio);
					});
				});
			} else {
				res.json({mensaje: "No se encontro el subservicio."});
			}
		});
	});*/