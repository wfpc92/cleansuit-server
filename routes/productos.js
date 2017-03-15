var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Productos = mongoose.model('Productos');

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

	router.get('/', function(req, res) {
		Productos.find(function(err, productos) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				productos: productos,
				mensaje: 'lista de productos'
			});
		});
	});

	router.post('/', function(req, res){
		var producto = new Productos({
			nombre: req.body.nombre,
			precio: req.body.precio,
			desc_corta: req.body.desc_corta,
			desc_larga: req.body.desc_larga,
			url_imagen: req.body.url_imagen
		});

		producto.save(function(err) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				producto: producto,
				mensaje: 'producto agregado'
			});
		});
	});

	router.get('/:id', function(req, res) {
		Productos.findById(req.params.id, function(err, producto) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				producto: producto,
				mensaje: 'informacion de producto'
			});
		});
	});

	router.put('/:id', function(req, res){
		Productos.findById(req.params.id, function(err, producto) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			//modificar atributos del producto
			producto.nombre = req.body.nombre || producto.nombre;
			producto.precio = req.body.precio || producto.precio;
			producto.desc_corta = req.body.desc_corta || producto.desc_corta;
			producto.desc_larga = req.body.desc_larga || producto.desc_larga;
			producto.url_imagen = req.body.url_imagen || producto.url_imagen;

			// Save the beer and check for errors
			producto.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				res.json({
					success: true,
					producto: producto,
					mensaje: 'producto modificado'
				});
			});
		});
	});

	router.delete('/:id', function(req, res){
		Productos.findByIdAndRemove(req.params.id, function(err, producto) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			res.json({
				success: true,
				producto: producto,
				mensaje: 'producto eliminado'
			});
		});
	});

	return router;
};
