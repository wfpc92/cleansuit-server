var express = require('express');
var router = express.Router();
var Prendas = require('../models/prendas');
var Ordenes = require('../models/ordenes');

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

	router.get('/codigo/:codigo', function(req, res) {
		var codigo = req.params.codigo;

		Ordenes.find(function(err, ordenes) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			for (var i in ordenes) {
				if(ordenes[i].recoleccion) {
					for (var j in ordenes[i].recoleccion.items.prendas) {
						if (ordenes[i].recoleccion.items.prendas[j].codigo = codigo) {
							prenda = ordenes[i].recoleccion.items.prendas[j];
							prenda.orden_id = ordenes[i]._id;
							return res.json({
								success: true,
								prenda: prenda,
								mensaje: 'prenda de codigo '+codigo
							});
						}
					}
				}
			}

			res.json({
				success: true,
				mensaje: 'no se encuentra informacion de prenda de codigo '+codigo
			});
			
		});
	});
	
	return router;
};
