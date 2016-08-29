var express = require('express');
var router = express.Router();

var Configuraciones = require('../models/configuraciones');

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));
	
	router.get('/', function(req, res) {
		Configuraciones.find(function(err, configuracionesLst) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			var configuraciones;

			if(configuracionesLst.length !== 0){
				configuraciones = configuracionesLst[0];
			} else {
				configuraciones = new Configuraciones();
			}

			res.json({
				success: true,
				configuraciones: configuraciones,
				mensaje: 'configuraciones de la aplicación.'
			});
		});
	});

	router.get('/versiones', function(req, res) {
		Configuraciones.find(function(err, configuracionesLst) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			var versiones = {
				inventario: 0,
				configuraciones: 0
			};

			if(configuracionesLst.length !== 0){
				versiones = configuracionesLst[0].versiones;
			}

			res.json({
				success: true,
				versiones: versiones,
				mensaje: 'versiones de informacion actual del API.'
			});
		});
	});


	router.post('/',	function(req, res){
		Configuraciones.find(function(err, configuracionesLst) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			var configuraciones;

			//si no existe una configuraciones se inicializa.
			if(configuracionesLst.length == 0){
				var configuraciones = crearConfiguraciones(req.body);
				mensaje = "configuraciones creada";
			} else {
				//si existe modificar la primera de acuerdo lo que viene en el body
				configuraciones = modificarConfiguraciones(configuracionesLst[0], req.body);
				mensaje = "configuraciones actualizada"
			}

			configuraciones.save(function(err){
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				res.json({
					success: true,
					configuraciones: configuraciones,
					mensaje: mensaje
				});
			});
		});
	});

	return router;
};
