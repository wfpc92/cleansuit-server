var express = require('express');
var router = express.Router();

var Productos = require('../models/productos');

router.get('/', function(req, res) {
	Productos.find(function(err, productos) {
		if (err) res.send(err);

		res.json(productos);
	});
});

router.post('/', function(req, res){
	var producto = new Productos();
	producto.nombre = req.body.nombre,
	producto.precio = req.body.precio,
	producto.desc_corta = req.body.desc_corta,
	producto.desc_larga = req.body.desc_larga,
	producto.foto = req.body.foto
	
	producto.save(function(err) {
		if (err) res.send(err);

		res.json({
			mensaje: 'producto agregado',
			datos: producto
		});
	});
});

router.get('/:id', function(req, res) {
	Productos.findById(req.params.id, function(err, producto) {
		if (err) res.send(err);

		res.json(producto);
	});
});

router.put('/:id', function(req, res){
	Productos.findById(req.params.id, function(err, producto) {
		if (err) res.send(err);

		//modificar atributos del producto
		producto.nombre = req.body.nombre || producto.nombre;
		producto.precio = req.body.precio || producto.precio;
		producto.desc_corta = req.body.desc_corta || producto.desc_corta;
		producto.desc_larga = req.body.desc_larga || producto.desc_larga;
		producto.foto = req.body.foto || producto.foto;

		// Save the beer and check for errors
		producto.save(function(err) {
			if (err) res.send(err);

			res.json(producto);
		});
	});
});

router.delete('/:id', function(req, res){
	Productos.findByIdAndRemove(req.params.id, function(err, producto) {
		if (err) res.send(err);

		res.json(producto)
	});
});

module.exports = router;