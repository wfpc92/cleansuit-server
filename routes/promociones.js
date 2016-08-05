var express = require('express');
var router = express.Router();
var Promociones = require('../models/promociones');

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

	router.get('/', function(req, res) {
		Promociones
		.find(function(err, promociones) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			console.log(promociones)
			res.json({
				success: true,
				promociones: promociones,
				mensaje: 'lista de promociones'
			});
		});
	});

	router.post('/', function(req, res){
		//req.body.items viene con el formato: [{_idItem: boolean}],
		var items = {};
		console.log(req.body.items)

		for(var i in req.body.items) {
			if(req.body.items[i]){
				items[i] = req.body.items[i];
			}
		}

		console.log(items)

		var promocion = new Promociones({
			url_imagen: req.body.url_imagen,
			descuento: req.body.descuento,
			codigo: req.body.codigo,
			fecha_inicio: req.body.fecha_inicio,
			fecha_fin: req.body.fecha_fin,
			descripcion: req.body.descripcion,
			items: items
		});
		
		promocion
		.save(function(err) {
			if (err) return res.json({success: false, mensaje: "Campos de promocion incompletos o invalidos.", error: err});

			res.json({
				success: true,
				promocion: promocion,
				mensaje: 'promocion agregada'
			});
		});
	});

	router.get('/:id', function(req, res) {
		Promociones
		.findById(req.params.id, function(err, promocion) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			
			res.json({
				success: true,
				promocion: promocion,
				mensaje: 'informacion de la promocion '
			});
		});
	});

	router.put('/:id', function(req, res){
		Promociones
		.findById(req.params.id, function(err, promocion) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			var items = {};
			for(var i in req.body.items) {
				if(req.body.items[i]){
					items[i] = req.body.items[i];
				}
			}

			//modificar atributos de la promocion
			promocion.url_imagen = req.body.url_imagen || promocion.url_imagen;
			promocion.descuento = req.body.descuento || promocion.descuento;
			promocion.codigo = req.body.codigo || promocion.codigo;
			promocion.fecha_inicio = req.body.fecha_inicio || promocion.fecha_inicio;
			promocion.fecha_fin = req.body.fecha_fin || promocion.fecha_fin;
			promocion.descripcion = req.body.descripcion || promocion.descripcion;
			promocion.items = items;
			
			// Save the beer and check for errors
			promocion.save(function(err) {
				if (err) return res.json({success: false, mensaje: "Campos de promocion incompletos o invalidos.", error: err});

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

	router.get('/validar/:cupon', function(req, res) {
		var descuentos = null;
		var cupon = req.params.cupon;
		
		Promociones
		.findOne({
			codigo: cupon
		}, function(err, promocion) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			
			if(!promocion) {
				return res.json({
					success: false, 
					mensaje: "El codigo '"+ cupon +"' no se encuentra disponible.", 
				});
			}

			if(promocion.vigente()) {
				mensaje = "Cupón válido.";
			} else {
				mensaje = "Cupón ya expiró.";
			}

			res.json({
				success: true,
				promocion: promocion,
				mensaje: mensaje
			});
		});
	});	

	return router;
};
