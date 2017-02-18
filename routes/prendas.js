var express = require('express');
var router = express.Router();
var Prendas = require('../models/prendas');
var Ordenes = require('../models/ordenes');
var Subservicios = require('../models/subservicios');

var buscarPrenda = function(codigo, cbSuccess, cbFail) {
	var encontroPrenda = false;
	var prenda = null, orden = null, indexPrenda = null;
		
	Ordenes
	.find(function(err, ordenes) {
		if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

		for (var i in ordenes) {
			if(ordenes[i].recoleccion) {
				for (var j in ordenes[i].recoleccion.items.prendas) {
					if (ordenes[i].recoleccion.items.prendas[j].codigo == codigo) {
						if (cbSuccess) 
							return cbSuccess(ordenes, i, j);
						return null;
					}
				}
			}
		}

		if (cbFail) 
			return cbFail();			
	});
};

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));

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
				prenda.orden = {};
 				prenda.orden.codigo =  ordenes[i].codigo;
				
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
/*
{ subservicio: 
   { _id: '58623356926f7f1c728984da',
     _creator: 
      { _id: '58623317926f7f1c728984d7',
        nombre: 'lavanderia',
        descripcion: 'lavanderia de ropa',
        __v: 2,
        subservicios: [Object] },
     nombre: 'camisas',
     descripcion: 'lavnaderia de camisas sucias',
     precio: 12000,
     detalles: 'laandaerlavnaderia de camisas suciaslavnaderia de camisas suciaslavnaderia de camisas suciaslavnaderia de camisas sucias',
     __v: 0 },
  codigo: '12345',
  fotos: [],
  orden: { codigo: 6 } } { hayNovedad: true,
  observaciones: 'observaciones',
  proceso: { _id: '1', nombre: 'Proceso 1' } }

*/
		buscarPrenda(prenda.codigo,
		function(ordenes, i, j) {
			var prenda = ordenes[i].recoleccion.items.prendas[j];
			
			if (typeof prenda.novedades == 'undefined') {
				prenda.novedades = [];
			}

			prenda.novedades.push(novedad);

			ordenes[i]
			.save(function(err) {
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

				res.json({
					success: true,
					prenda: prenda,
					mensaje: 'novedad agregada a la prenda'
				});
			});
		},function() {
			res.json({
				success: true,
				mensaje: "no se agrego una novedad"
			});
		});
		
	});
	
	return router;
};
