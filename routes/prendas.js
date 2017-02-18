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
		.findById(prenda.orden._id, function(err, ordenGuardada) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			if (typeof ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades == 'undefined') {
				console.log("novedades no existe")
				//ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades = [];
				ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades = "";
			}
			ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades = "funciona";
			console.log(ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades)
			//ordenGuardada.recoleccion.items.prendas[prenda.codigo].novedades.push(novedad);
			console.log(ordenGuardada.recoleccion.items.prendas[prenda.codigo])
			ordenGuardada
			.save(function(err) {
				console.log("error", err)
				Ordenes
				.findById(prenda.orden._id, function(err, ordenGuardada2) {
					console.log("error2", err)
					res.json({
						success: true,
						prenda: ordenGuardada2.recoleccion.items.prendas[prenda.codigo],
						mensaje: 'novedad agregada a la prenda'
					});
				});	
			})
			
		})


		/*buscarPrenda(prenda.codigo,
		function(ordenes, i, j) {
			

			console.log("ordenes[i]", ordenes[i], i, j, "prenda", prenda);

			ordenes[i]
			.save(function(err) {
				

				
				
			});

			/*Ordenes
			.findById(ordenes[i]._id,function(err, orden) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				
				if (typeof orden.recoleccion.items.prendas[j].novedades == 'undefined') {
					orden.recoleccion.items.prendas[j].novedades = [];
				}

				//orden.recoleccion.items.prendas[j].novedades.push(novedad);

				orden.save(function(err) {
					console.log(err)
					res.json({
						success: true,
						prenda: prenda,
						orden: orden,
						mensaje: 'novedad agregada a la prenda'
					});
				});
			});


		},function() {
			res.json({
				success: true,
				mensaje: "no se agrego una novedad"
			});
		});*/
		
	});
	
	return router;
};
