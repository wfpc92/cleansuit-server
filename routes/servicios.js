var express = require('express');
var router = express.Router();

var Servicios = require('../models/servicios');
var Subservicios = require('../models/subservicios');



module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));
	
	router.get('/', function(req, res) {
		//req.user
		Servicios
			.find()
			.populate('subservicios')
			.exec(function(err, servicios) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				
				res.json({
					success: true,
					servicios: servicios,
					mensaje: 'lista de servicios'
				});
			});
	});

	router.post('/', function(req, res){
		var servicio = new Servicios({
			nombre: req.body.nombre,
			descripcion: req.body.descripcion
		});
		
		servicio.save(function(err) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				servicio: servicio,
				mensaje: 'servicio agregado.'
			});
		});
	});

	router.get('/:idServicio', function(req, res) {
		Servicios.findById(req.params.idServicio, function(err, servicio) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				servicio: servicio,
				mensaje: 'informacion de servicio.'
			});
		});
	});

	router.put('/:idServicio', function(req, res){
		Servicios.findById(req.params.idServicio, function(err, servicio) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			//modificar atributos del servicio
			servicio.nombre = req.body.nombre || servicio.nombre;
			servicio.descripcion = req.body.descripcion || servicio.descripcion;

			// Save the beer and check for errors
			servicio.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				res.json({
					success: true,
					servicio: servicio,
					mensaje: 'servicio modificado.'
				});
			});
		});
	});

	router.delete('/:idServicio', function(req, res){
		Servicios.findByIdAndRemove(req.params.idServicio, function(err, servicio) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				servicio: servicio,
				mensaje: 'servicio eliminado.'
			});
		});
	});

	//subservicios:
	router.get('/subservicios/all', function(req, res) {
		Subservicios
		.find()
		.populate('_creator')
		.exec(function(err, subservicios) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			
			res.json({
				success: true,
				subservicios: subservicios,
				mensaje: 'lista de subservicios del sistema '
			});
		});
	});

	router.get('/:idServicio/subservicios', function(req, res) {
		Subservicios
		.find({_creator: req.params.idServicio})
		.populate('_creator')
		.exec(function(err, subservicios) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			
			res.json({
				success: true,
				subservicios: subservicios,
				mensaje: 'lista de subservicios con id ' + req.params.idServicio
			});
		});
	});

	router.post('/:idServicio/subservicios', function(req, res) {
		Servicios.findById(req.params.idServicio, function(err, servicio) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			if(!servicio) return res.json({success: false, mensaje: "no se encuentra el servicio"});
			
			var subservicio = new Subservicios({
				_creator: servicio._id,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				precio: req.body.precio,
				detalles: req.body.detalles
			});
		
			subservicio.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				servicio.subservicios.push(subservicio);
				servicio.save(function(err) {
					if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

					res.json({
						success: true,
						subservicio: subservicio,
						mensaje: "subservicio creado en el servicio: "+servicio._id,
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
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				
				res.json({
					success: true,
					subservicio: subservicio,
					mensaje: "informacion del subservicio del servicio: "+req.params.idSubservicio,
				});
			});
	});

	router.put('/subservicios/:idSubservicio', function(req, res){
		Subservicios.findById(req.params.idSubservicio, function(err, subservicio) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			//modificar atributos del subservicio
			subservicio.nombre = req.body.nombre || subservicio.nombre;
			subservicio.descripcion = req.body.descripcion || subservicio.descripcion;
			subservicio.precio = req.body.precio || subservicio.precio;
			subservicio.detalles = req.body.detalles || subservicio.detalles;

			// Save the beer and check for errors
			subservicio.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				res.json({
					success: true,
					subservicio: subservicio,
					mensaje: "subservicio modificado del servicio: "+req.params.idSubservicio,
				});
			});
		});
	});

	router.delete('/subservicios/:idSubservicio', function(req, res){
		Subservicios.findByIdAndRemove(req.params.idSubservicio, function(err, subservicio) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			if(subservicio) {
				Servicios.findById(subservicio._creator, function(err, servicio) {
					if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

					servicio.subservicios.pull({ _id: subservicio._id }); // removed
					servicio.save(function(err) {
						if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

						res.json({
							success: true,
							subservicio: subservicio,
							mensaje: "subservicio eliminado del servicio: "+req.params.idSubservicio,
						});
					});
				});
			} else {
				res.json({success: false, mensaje: "No se encontro el subservicio."});
			}
		});
	});

	return router;
};
