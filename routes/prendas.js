var express = require('express');
var router = express.Router();
var Prendas = require('../models/prendas');
var Ordenes = require('../models/ordenes');
var Subservicios = require('../models/subservicios');

var buscarPrenda = function(codigo, cbSuccess, cbFail) {		
	Ordenes
	.find(function(err, ordenes) {
		if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
		
		//en caso que se envie el codigo nulo se retornan todas las prendas
		var prendas = {};

		for (var i in ordenes) {
			if(ordenes[i].recoleccion) {
				for (var j in ordenes[i].recoleccion.items.prendas) {
					if (ordenes[i].recoleccion.items.prendas[j].codigo == codigo) {
						if (cbSuccess) 
							return cbSuccess(ordenes, i, j);
						return null;
					}
				}
				if (!codigo) {
					prendas = Object.assign(prendas, ordenes[i].recoleccion.items.prendas);
				}
			}
		}

		if(!codigo) {
			if (cbSuccess) 
				return cbSuccess(prendas);
		}

		if (cbFail) 
			return cbFail();			
	});
};

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

	router.get('/', function(req, res) {
		buscarPrenda(null, function(prendas) {
			res.json({
				success: true,
				prendas: prendas,
				mensaje: 'listado de prendas'
			});
		}, function() {
			res.json({
				success: true,
				mensaje: 'no se encontraron prendas'
			});
		});
		
	});

	router.get('/codigo/:codigo', function(req, res) {
		var codigo = req.params.codigo;

		buscarPrenda(codigo, 
		function(ordenes, i, j) {
			var prenda = ordenes[i].recoleccion.items.prendas[j];
			Subservicios
			.findOne({_id: prenda.subservicio._id})
			.populate('_creator')
			.exec(function(err, subservicios) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				
				prenda.subservicio = subservicios;
				delete prenda.servicio;
				prenda.orden = {
					_id: ordenes[i]._id,
					codigo: ordenes[i].codigo
				};
				
				res.json({
					success: true,
					prenda: prenda,
					mensaje: 'prenda de codigo '+codigo
				});
				
			});
		}, 
		function() {
			res.json({
				success: true,
				mensaje: 'no se encuentra informacion de prenda de codigo '+codigo
			});
		});		
	});

	router.post('/novedad', function(req, res) {
		var prenda = req.body.prenda;
		var novedad = req.body.novedad;
		novedad.fecha = new Date();

		Ordenes
		.findById(prenda.orden._id)
		.populate('cliente_id')
		.exec(function(err, ordenGuardada) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			if (typeof ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades == 'undefined') {
				ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades = [];
			}
			
			ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades.push(novedad);
			
			Ordenes
			.findOneAndUpdate({_id: ordenGuardada._id}, ordenGuardada, function(err, sw) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				
				res.json({
					success: true,
					prenda: ordenGuardada.recoleccion.items.prendas[prenda.codigo],
					mensaje: 'novedad agregada a la prenda'
				});	
			})	
		})
	});
	
	return router;
};
