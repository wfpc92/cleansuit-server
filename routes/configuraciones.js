var express = require('express');
var router = express.Router();

var Configuraciones = require('../models/configuraciones');

function crearConfiguraciones(config) {
	var configuraciones = new Configuraciones({
		domicilio: config.domicilio || 0,
		versionInventario: config.versionInventario || 0,
		sobreEmpresa: config.sobreEmpresa || "Información sobre ésta empresa no editada",
		terminosCondiciones: config.terminosCondiciones || "Terminos y condiciones no editadas"
	});
	return configuraciones;
}

function modificarConfiguraciones(config, nuevaConfig) {
	config.domicilio = nuevaConfig.domicilio || config.domicilio;
	config.versionInventario = nuevaConfig.versionInventario || config.versionInventario;
	config.sobreEmpresa = nuevaConfig.sobreEmpresa || config.sobreEmpresa;
	config.terminosCondiciones = nuevaConfig.terminosCondiciones || config.terminosCondiciones;
	return config
}

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));
	
	router.get('/', function(req, res) {
		Configuraciones.find(function(err, configuracionesLst) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			var configuraciones = crearConfiguraciones({});

			if(configuracionesLst.length !== 0){
				configuraciones = configuracionesLst[0];
			}

			res.json({
				success: true,
				configuraciones: configuraciones,
				mensaje: 'configuraciones de la aplicación.'
			});
		});
	});

	router.get('/version-inventario', function(req, res) {
		Configuraciones.find(function(err, configuracionesLst) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			var versionInventario = 0;

			if(configuracionesLst.length !== 0){
				versionInventario = configuracionesLst[0].versionInventario;
			}

			res.json({
				success: true,
				versionInventario: versionInventario,
				mensaje: 'version de inventario actual del API.'
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
