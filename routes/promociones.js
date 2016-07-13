var express = require('express');
var router = express.Router();
var Promociones = require('../models/promociones');

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

	router.get('/', function(req, res) {
		Promociones
		.find(function(err, promociones) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				promociones: promociones,
				mensaje: 'lista de promociones'
			});
		});
	});

	router.post('/', function(req, res){
		var promocion = new Promociones({
			url_imagen: req.body.url_imagen,
			descuento: req.body.descuento,
			codigo: req.body.codigo,
			descripcion: req.body.descripcion,
			items: req.body.items
		});
		
		promocion.save(function(err) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				promocion: promocion,
				mensaje: 'promocion agregada'
			});
		});
	});

	router.get('/:id', function(req, res) {
		Promociones.findById(req.params.id, function(err, promocion) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			
			res.json({
				success: true,
				promocion: promocion,
				mensaje: 'informacion de la promocion '
			});
		});
	});

	router.put('/:id', function(req, res){
		Promociones.findById(req.params.id, function(err, promocion) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			//modificar atributos de la promocion
			promocion.url_imagen = req.body.url_imagen || promocion.url_imagen;
			promocion.descuento = req.body.descuento || promocion.descuento;
			promocion.codigo = req.body.codigo || promocion.codigo;
			promocion.descripcion = req.body.descripcion || promocion.descripcion;
			promocion.items = req.body.items || promocion.items;
			
			// Save the beer and check for errors
			promocion.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				res.json({
					success: true,
					promocion: promocion,
					mensaje: 'promocion modificado'
				});
			});
		});
	});

	router.delete('/:id', function(req, res){
		Promociones.findByIdAndRemove(req.params.id, function(err, promocion) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				promocion: promocion,
				mensaje: 'promocion eliminada'
			});
		});
	});
	
	return router;
};
