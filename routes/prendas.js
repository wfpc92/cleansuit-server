var express = require('express');
var router = express.Router();
var Prendas = require('../models/prendas');
var Ordenes = require('../models/ordenes');
var Subservicios = require('../models/subservicios');

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

	router.get('/codigo/:codigo', function(req, res) {
		var codigo = req.params.codigo;

		Ordenes
		.find(function(err, ordenes) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
			var encontroPrenda = false;

			for (var i in ordenes) {
				if(ordenes[i].recoleccion) {
					for (var j in ordenes[i].recoleccion.items.prendas) {
						if (ordenes[i].recoleccion.items.prendas[j].codigo == codigo) {
							prenda = ordenes[i].recoleccion.items.prendas[j];
							console.log(ordenes[i])
							prenda.orden = {};
							prenda.orden.codigo =  ordenes[i].codigo;
							encontroPrenda = true;
							break;
						}
					}
					if(encontroPrenda) {
						break;
					}
				}
			}

			if (encontroPrenda) {
				Subservicios
				.findOne({_id: prenda.subservicio._id})
				.populate('_creator')
				.exec(function(err, subservicios) {
					if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
					
					prenda.subservicio = subservicios;
					delete prenda.servicio;
					
					res.json({
						success: true,
						prenda: prenda,
						mensaje: 'prenda de codigo '+codigo
					});
					
				});	
			} else {
				res.json({
					success: true,
					mensaje: 'no se encuentra informacion de prenda de codigo '+codigo
				});
			}			
		});
	});
	
	return router;
};
